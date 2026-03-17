from __future__ import annotations

from math import inf

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.llm import LLMClient, LLMResult
from app.models import EstadoMaquina, Maquina, TipoMaquina


class MacheriaAgent:
    """Core Sync: protege stock de machos frente al cuello de botella."""

    def __init__(self, session: Session, llm_client: LLMClient | None = None) -> None:
        self._session = session
        self._llm_client = llm_client or LLMClient()

    def _operational_core_machine_count(self) -> int:
        count = self._session.scalar(
            select(func.count()).select_from(Maquina).where(
                Maquina.tipo == TipoMaquina.MACHERIA,
                Maquina.estado == EstadoMaquina.OPERATIVO,
            )
        )
        return int(count or 0)

    def analyze(
        self,
        *,
        molding_rate_per_hour: int,
        core_rate_per_hour_per_machine: int,
        current_core_stock: int,
        safety_buffer_hours: float,
        horizon_hours: float,
        include_llm: bool,
    ) -> dict:
        operational_machines = self._operational_core_machine_count()
        total_core_rate = operational_machines * core_rate_per_hour_per_machine
        deficit_rate = max(molding_rate_per_hour - total_core_rate, 0)

        if deficit_rate == 0:
            hours_until_stockout = inf
            stockout_label = "no_risk"
        else:
            hours_until_stockout = current_core_stock / deficit_rate if current_core_stock else 0.0
            stockout_label = "critical" if hours_until_stockout <= safety_buffer_hours else "warning"

        recommendation = (
            "Cambiar secuencia a piezas sin macho y aumentar WIP de seguridad."
            if deficit_rate > 0 and hours_until_stockout <= safety_buffer_hours
            else "Mantener secuencia actual y monitorizar stock de machos."
        )

        data = {
            "operational_core_machines": operational_machines,
            "molding_rate_per_hour": molding_rate_per_hour,
            "total_core_rate_per_hour": total_core_rate,
            "current_core_stock": current_core_stock,
            "horizon_hours": horizon_hours,
            "hours_until_stockout": None if hours_until_stockout == inf else round(hours_until_stockout, 2),
            "status": "stable" if deficit_rate == 0 else stockout_label,
            "recommendation": recommendation,
        }

        llm_result = self._advise(data) if include_llm else self._disabled_llm()
        return {
            "agent": "macheria",
            "mode": "hybrid" if include_llm else "rules-only",
            "data": data,
            "llm": self._serialize_llm(llm_result),
        }

    def _advise(self, data: dict) -> LLMResult:
        return self._llm_client.generate_operational_advice(
            system_prompt=(
                "Eres un planificador industrial. Resume el riesgo de stock de machos y propone una "
                "accion operativa concreta en no mas de 4 frases. No inventes datos."
            ),
            user_prompt=f"Analiza esta situacion de macheria: {data}",
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
