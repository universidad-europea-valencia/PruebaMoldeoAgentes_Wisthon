from __future__ import annotations

from sqlalchemy.orm import Session

from app.agents.fusion_agent import FusionAgent
from app.agents.line_agent import LineAgent
from app.agents.macheria_agent import MacheriaAgent
from app.agents.maintenance_agent import MaintenanceAgent
from app.llm import LLMClient
from app.schemas import LinePlanRequest, MacheriaRequest, MaintenanceIncidentRequest


class OrchestratorAgent:
    """Coordina el workflow planning y reactive definido en arquitectura."""

    def __init__(self, session: Session, llm_client: LLMClient | None = None) -> None:
        self._session = session
        self._llm_client = llm_client or LLMClient()

    def planning(
        self,
        *,
        macheria_request: MacheriaRequest,
        line_request: LinePlanRequest | None,
        include_llm: bool,
    ) -> dict:
        fusion = FusionAgent(self._session, llm_client=self._llm_client).run(include_llm=include_llm)
        macheria = MacheriaAgent(self._session, llm_client=self._llm_client).analyze(
            molding_rate_per_hour=macheria_request.molding_rate_per_hour,
            core_rate_per_hour_per_machine=macheria_request.core_rate_per_hour_per_machine,
            current_core_stock=macheria_request.current_core_stock,
            safety_buffer_hours=macheria_request.safety_buffer_hours,
            horizon_hours=macheria_request.horizon_hours,
            include_llm=include_llm and macheria_request.include_llm,
        )

        line = None
        if line_request is not None:
            line = LineAgent(self._session, llm_client=self._llm_client).plan(
                line_id=line_request.line_id,
                orders=line_request.orders,
                include_llm=include_llm and line_request.include_llm,
            )

        return {
            "workflow": "planning",
            "fusion": fusion,
            "macheria": macheria,
            "linea": line,
        }

    def reactive(
        self,
        *,
        maintenance_request: MaintenanceIncidentRequest,
        macheria_request: MacheriaRequest,
        include_llm: bool,
    ) -> dict:
        maintenance = MaintenanceAgent(self._session, llm_client=self._llm_client).handle_incident(
            machine_id=maintenance_request.machine_id,
            new_status=maintenance_request.new_status,
            include_llm=include_llm and maintenance_request.include_llm,
        )
        replanned = self.planning(
            macheria_request=macheria_request,
            line_request=None,
            include_llm=include_llm,
        )
        return {
            "workflow": "reactive",
            "incident": maintenance,
            "replan": replanned,
        }
