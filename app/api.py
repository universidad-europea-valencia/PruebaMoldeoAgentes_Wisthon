from __future__ import annotations

from fastapi import FastAPI, HTTPException

from app.agents.fusion_agent import FusionAgent
from app.agents.line_agent import LineAgent
from app.agents.macheria_agent import MacheriaAgent
from app.agents.maintenance_agent import MaintenanceAgent
from app.agents.orchestrator_agent import OrchestratorAgent
from app.agents.quality_agent import QualityAgent
from app.config import get_settings
from app.database import session_scope, test_connection
from app.llm import LLMClient
from app.schemas import (
    FusionPlanRequest,
    LinePlanRequest,
    MacheriaRequest,
    MaintenanceIncidentRequest,
    OrchestratorPlanningRequest,
    OrchestratorReactiveRequest,
    QualityRequest,
)

settings = get_settings()
app = FastAPI(title=settings.app_name)
llm_client = LLMClient(settings)


@app.get("/health")
def health() -> dict[str, str]:
    try:
        test_connection()
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"db_unreachable: {exc}") from exc
    return {"status": "ok", "service": settings.app_name}


@app.get("/llm/health")
def llm_health() -> dict[str, object]:
    return llm_client.health()


@app.post("/fusion/plan")
def run_fusion_plan(request: FusionPlanRequest) -> dict[str, object]:
    try:
        with session_scope() as session:
            agent = FusionAgent(session, llm_client=llm_client)
            result = agent.run(include_llm=request.include_llm)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"fusion_agent_error: {exc}") from exc

    return result


@app.post("/macheria/analyze")
def analyze_macheria(request: MacheriaRequest) -> dict[str, object]:
    try:
        with session_scope() as session:
            result = MacheriaAgent(session, llm_client=llm_client).analyze(
                molding_rate_per_hour=request.molding_rate_per_hour,
                core_rate_per_hour_per_machine=request.core_rate_per_hour_per_machine,
                current_core_stock=request.current_core_stock,
                safety_buffer_hours=request.safety_buffer_hours,
                horizon_hours=request.horizon_hours,
                include_llm=request.include_llm,
            )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"macheria_agent_error: {exc}") from exc

    return result


@app.post("/linea/plan")
def plan_line(request: LinePlanRequest) -> dict[str, object]:
    try:
        with session_scope() as session:
            result = LineAgent(session, llm_client=llm_client).plan(
                line_id=request.line_id,
                orders=request.orders,
                include_llm=request.include_llm,
            )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"line_agent_error: {exc}") from exc

    return result


@app.post("/calidad/replenish")
def replenish_quality(request: QualityRequest) -> dict[str, object]:
    try:
        result = QualityAgent(llm_client=llm_client).replenish(
            target_quantity=request.target_quantity,
            scrap_rate=request.scrap_rate,
            include_llm=request.include_llm,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"quality_agent_error: {exc}") from exc

    return result


@app.post("/mantenimiento/incident")
def handle_maintenance(request: MaintenanceIncidentRequest) -> dict[str, object]:
    try:
        with session_scope() as session:
            result = MaintenanceAgent(session, llm_client=llm_client).handle_incident(
                machine_id=request.machine_id,
                new_status=request.new_status,
                include_llm=request.include_llm,
            )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"maintenance_agent_error: {exc}") from exc

    return result


@app.post("/orchestrator/planning")
def orchestrate_planning(request: OrchestratorPlanningRequest) -> dict[str, object]:
    try:
        with session_scope() as session:
            result = OrchestratorAgent(session, llm_client=llm_client).planning(
                macheria_request=request.macheria,
                line_request=request.line,
                include_llm=request.include_llm,
            )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"orchestrator_planning_error: {exc}") from exc

    return result


@app.post("/orchestrator/reactive")
def orchestrate_reactive(request: OrchestratorReactiveRequest) -> dict[str, object]:
    try:
        with session_scope() as session:
            result = OrchestratorAgent(session, llm_client=llm_client).reactive(
                maintenance_request=request.maintenance,
                macheria_request=request.macheria,
                include_llm=request.include_llm,
            )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"orchestrator_reactive_error: {exc}") from exc

    return result
