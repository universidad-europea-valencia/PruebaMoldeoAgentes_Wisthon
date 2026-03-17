from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.llm import LLMClient, LLMResult
from app.models import EstadoMaquina, Maquina
from app.schemas import LineOrderInput


class LineAgent:
    """KW & Disa: calcula carga, tiempos de ciclo y cambios de modelo."""

    def __init__(self, session: Session, llm_client: LLMClient | None = None) -> None:
        self._session = session
        self._llm_client = llm_client or LLMClient()

    def plan(self, *, line_id: str, orders: list[LineOrderInput], include_llm: bool) -> dict:
        machine = self._session.scalar(select(Maquina).where(Maquina.id == line_id))
        machine_status = machine.estado.value if machine else "no_registrada"

        jobs = []
        accumulated_minutes = 0.0
        previous_model: str | None = None

        for order in orders:
            changeover = order.changeover_minutes if previous_model and previous_model != order.modelo else 0.0
            runtime_minutes = (order.cantidad * order.cycle_seconds) / 60.0
            accumulated_minutes += changeover + runtime_minutes
            jobs.append(
                {
                    "referencia": order.referencia,
                    "modelo": order.modelo,
                    "cantidad": order.cantidad,
                    "changeover_minutes": round(changeover, 2),
                    "runtime_minutes": round(runtime_minutes, 2),
                    "cumulative_minutes": round(accumulated_minutes, 2),
                }
            )
            previous_model = order.modelo

        data = {
            "line_id": line_id,
            "line_status": machine_status,
            "is_available": machine_status in {EstadoMaquina.OPERATIVO.value, "no_registrada"},
            "jobs": jobs,
            "total_minutes": round(accumulated_minutes, 2),
        }

        llm_result = self._advise(data) if include_llm else self._disabled_llm()
        return {
            "agent": "linea",
            "mode": "hybrid" if include_llm else "rules-only",
            "data": data,
            "llm": self._serialize_llm(llm_result),
        }

    def _advise(self, data: dict) -> LLMResult:
        return self._llm_client.generate_operational_advice(
            system_prompt=(
                "Eres responsable de linea de moldeo. Resume el plan, detecta cambios de modelo "
                "costosos y sugiere un ajuste de secuencia en no mas de 4 frases."
            ),
            user_prompt=f"Plan de linea: {data}",
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
