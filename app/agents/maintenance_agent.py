from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.llm import LLMClient, LLMResult
from app.models import EstadoMaquina, Maquina, OrdenProduccion, RutaAcabado


class MaintenanceAgent:
    """Incident Handler: gestiona averias y re-rutas de acabado."""

    def __init__(self, session: Session, llm_client: LLMClient | None = None) -> None:
        self._session = session
        self._llm_client = llm_client or LLMClient()

    def handle_incident(self, *, machine_id: str, new_status: str, include_llm: bool) -> dict:
        machine = self._session.scalar(select(Maquina).where(Maquina.id == machine_id))
        if machine is None:
            raise ValueError(f"Maquina no encontrada: {machine_id}")

        machine.estado = EstadoMaquina(new_status)
        rerouted_orders = []
        if machine.estado != EstadoMaquina.OPERATIVO:
            rerouted_orders = self._reroute_orders(machine_id)
        self._session.flush()

        data = {
            "machine_id": machine_id,
            "new_status": new_status,
            "rerouted_orders": rerouted_orders,
            "reroute_count": len(rerouted_orders),
        }

        llm_result = self._advise(data) if include_llm else self._disabled_llm()
        return {
            "agent": "mantenimiento",
            "mode": "hybrid" if include_llm else "rules-only",
            "data": data,
            "llm": self._serialize_llm(llm_result),
        }

    def _reroute_orders(self, machine_id: str) -> list[dict]:
        route = self._infer_route_from_machine(machine_id)
        if route is None:
            return []

        fallback_route = self._fallback_route(route)
        orders = self._session.scalars(
            select(OrdenProduccion).where(OrdenProduccion.ruta_acabado == route)
        ).all()

        rerouted = []
        for order in orders:
            order.ruta_acabado = fallback_route
            rerouted.append(
                {
                    "order_id": order.id,
                    "referencia": order.referencia,
                    "from_route": route.value,
                    "to_route": fallback_route.value,
                }
            )
        return rerouted

    @staticmethod
    def _infer_route_from_machine(machine_id: str) -> RutaAcabado | None:
        upper_id = machine_id.upper()
        if upper_id.startswith("CNC"):
            return RutaAcabado.CNC
        if upper_id.startswith("ROBOT"):
            return RutaAcabado.ROBOT
        if upper_id.startswith("MANUAL"):
            return RutaAcabado.MANUAL
        return None

    @staticmethod
    def _fallback_route(route: RutaAcabado) -> RutaAcabado:
        if route == RutaAcabado.CNC:
            return RutaAcabado.MANUAL
        if route == RutaAcabado.ROBOT:
            return RutaAcabado.CNC
        return RutaAcabado.ROBOT

    def _advise(self, data: dict) -> LLMResult:
        return self._llm_client.generate_operational_advice(
            system_prompt=(
                "Eres responsable de mantenimiento industrial. Resume el incidente, el impacto "
                "operativo y la accion inmediata en no mas de 4 frases."
            ),
            user_prompt=f"Incidente de mantenimiento: {data}",
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
