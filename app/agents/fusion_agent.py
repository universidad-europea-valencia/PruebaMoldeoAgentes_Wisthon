from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass
from itertools import permutations
from typing import Iterable

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.llm import LLMClient, LLMResult
from app.models import Material, MatrizTransicion, OrdenProduccion


@dataclass(frozen=True)
class TransitionCost:
    minutes: int
    energy: float

    @property
    def score(self) -> float:
        # Penaliza el tiempo y pondera energia para optimizar cambios de metal.
        return float(self.minutes) + (self.energy * 10.0)


class FusionAgent:
    """Lead Metallurgist: optimiza la secuencia de aleaciones."""

    def __init__(self, session: Session, llm_client: LLMClient | None = None) -> None:
        self._session = session
        self._llm_client = llm_client or LLMClient()
        self._transition_index = self._load_transition_index()

    def _load_transition_index(self) -> dict[tuple[str, str], TransitionCost]:
        rows = self._session.scalars(select(MatrizTransicion)).all()
        return {
            (row.metal_origen, row.metal_destino): TransitionCost(
                minutes=row.tiempo_minutos,
                energy=row.coste_energetico,
            )
            for row in rows
        }

    @staticmethod
    def _infer_family(material_id: str, description: str | None) -> str:
        merged = f"{material_id} {description or ''}".lower()
        if "ferrit" in merged:
            return "ferritic"
        if "perlit" in merged:
            return "perlitic"
        return "unknown"

    def _fallback_transition(self, origin: Material, destination: Material) -> TransitionCost:
        if origin.id == destination.id:
            return TransitionCost(minutes=0, energy=0.0)

        origin_family = self._infer_family(origin.id, origin.descripcion)
        destination_family = self._infer_family(destination.id, destination.descripcion)

        if origin_family == "ferritic" and destination_family == "perlitic":
            return TransitionCost(minutes=15, energy=1.2)
        if origin_family == "perlitic" and destination_family == "ferritic":
            return TransitionCost(minutes=90, energy=4.0)
        return TransitionCost(minutes=45, energy=2.5)

    def _transition_cost(self, origin: Material, destination: Material) -> TransitionCost:
        return self._transition_index.get(
            (origin.id, destination.id), self._fallback_transition(origin, destination)
        )

    @staticmethod
    def _path_score(path: Iterable[str], material_index: dict[str, Material], agent: "FusionAgent") -> float:
        sequence = list(path)
        if len(sequence) < 2:
            return 0.0

        score = 0.0
        for idx in range(len(sequence) - 1):
            origin = material_index[sequence[idx]]
            destination = material_index[sequence[idx + 1]]
            score += agent._transition_cost(origin, destination).score
        return score

    def _best_metal_path(self, material_ids: list[str], material_index: dict[str, Material]) -> list[str]:
        if len(material_ids) <= 1:
            return material_ids

        if len(material_ids) <= 8:
            best = min(
                permutations(material_ids),
                key=lambda candidate: self._path_score(candidate, material_index, self),
            )
            return list(best)

        # Heuristica para casos grandes: vecino mas barato desde cada inicio.
        best_path: list[str] | None = None
        best_score: float | None = None

        for start in material_ids:
            unvisited = set(material_ids)
            unvisited.remove(start)
            path = [start]
            current = start

            while unvisited:
                current_material = material_index[current]
                next_material = min(
                    unvisited,
                    key=lambda candidate: self._transition_cost(
                        current_material, material_index[candidate]
                    ).score,
                )
                path.append(next_material)
                unvisited.remove(next_material)
                current = next_material

            score = self._path_score(path, material_index, self)
            if best_score is None or score < best_score:
                best_score = score
                best_path = path

        return best_path or material_ids

    def generate_plan(self) -> list[dict]:
        orders = self._session.scalars(
            select(OrdenProduccion).order_by(OrdenProduccion.fecha_entrega.asc(), OrdenProduccion.id.asc())
        ).all()

        if not orders:
            return []

        material_ids = sorted({order.metal_id for order in orders})
        materials = self._session.scalars(select(Material).where(Material.id.in_(material_ids))).all()
        material_index = {material.id: material for material in materials}

        # Asegura un material minimo si la FK existe pero no se pudo leer la descripcion.
        for missing in set(material_ids) - set(material_index):
            material_index[missing] = Material(id=missing, descripcion=None)

        best_path = self._best_metal_path(material_ids, material_index)
        grouped_orders: dict[str, list[OrdenProduccion]] = defaultdict(list)
        for order in orders:
            grouped_orders[order.metal_id].append(order)

        planned_orders: list[dict] = []
        previous_material: Material | None = None

        for metal_id in best_path:
            for order in grouped_orders.get(metal_id, []):
                current_material = material_index[metal_id]
                transition = (
                    TransitionCost(minutes=0, energy=0.0)
                    if previous_material is None
                    else self._transition_cost(previous_material, current_material)
                )

                planned_orders.append(
                    {
                        "order_id": order.id,
                        "referencia": order.referencia,
                        "metal_id": order.metal_id,
                        "cantidad_total": order.cantidad_total,
                        "fecha_entrega": order.fecha_entrega.isoformat(),
                        "transition_minutes": transition.minutes,
                        "transition_energy": transition.energy,
                        "transition_score": transition.score,
                    }
                )
                previous_material = current_material

        return planned_orders

    def _build_summary(self, plan: list[dict]) -> dict:
        ordered_metals = []
        total_transition_minutes = 0
        total_transition_energy = 0.0

        for step in plan:
            if not ordered_metals or ordered_metals[-1] != step["metal_id"]:
                ordered_metals.append(step["metal_id"])
            total_transition_minutes += step["transition_minutes"]
            total_transition_energy += step["transition_energy"]

        return {
            "sequence": ordered_metals,
            "total_orders": len(plan),
            "total_transition_minutes": total_transition_minutes,
            "total_transition_energy": round(total_transition_energy, 2),
        }

    def _advise(self, summary: dict, plan: list[dict]) -> LLMResult:
        compact_steps = [
            {
                "referencia": step["referencia"],
                "metal_id": step["metal_id"],
                "transition_minutes": step["transition_minutes"],
            }
            for step in plan
        ]
        return self._llm_client.generate_operational_advice(
            system_prompt=(
                "Eres un metalurgista senior. Explica por que la secuencia propuesta es razonable, "
                "señala el principal riesgo operativo y da una recomendacion concreta en no mas de 5 frases."
            ),
            user_prompt=f"Resumen de fusion: {summary}. Pasos: {compact_steps}",
        )

    def _disabled_llm(self) -> LLMResult:
        return LLMResult(enabled=False, provider="disabled", model=None, content=None)

    @staticmethod
    def _serialize_llm(result: LLMResult) -> dict:
        return {
            "enabled": result.enabled,
            "provider": result.provider,
            "model": result.model,
            "content": result.content,
            "error": result.error,
        }

    def run(self, include_llm: bool = True) -> dict:
        plan = self.generate_plan()
        summary = self._build_summary(plan)
        llm_result = self._advise(summary, plan) if include_llm else self._disabled_llm()
        return {
            "agent": "fusion",
            "mode": "hybrid" if include_llm else "rules-only",
            "data": {
                "summary": summary,
                "plan": plan,
            },
            "llm": self._serialize_llm(llm_result),
        }
