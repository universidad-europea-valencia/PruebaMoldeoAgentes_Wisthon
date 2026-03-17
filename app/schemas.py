from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class FusionPlanRequest(BaseModel):
    include_llm: bool = Field(default=True)


class MacheriaRequest(BaseModel):
    molding_rate_per_hour: int = Field(default=300, gt=0)
    core_rate_per_hour_per_machine: int = Field(default=50, gt=0)
    current_core_stock: int = Field(default=200, ge=0)
    safety_buffer_hours: float = Field(default=4.0, gt=0)
    horizon_hours: float = Field(default=8.0, gt=0)
    include_llm: bool = Field(default=True)


class LineOrderInput(BaseModel):
    referencia: str
    modelo: str
    cantidad: int = Field(gt=0)
    cycle_seconds: float = Field(gt=0)
    changeover_minutes: float = Field(default=0.0, ge=0)


class LinePlanRequest(BaseModel):
    line_id: str = Field(default="DISA")
    orders: list[LineOrderInput]
    include_llm: bool = Field(default=True)


class QualityRequest(BaseModel):
    target_quantity: int = Field(gt=0)
    scrap_rate: float = Field(ge=0.0, lt=1.0)
    include_llm: bool = Field(default=True)


class MaintenanceIncidentRequest(BaseModel):
    machine_id: str
    new_status: Literal["operativo", "averia", "mantenimiento"] = "averia"
    include_llm: bool = Field(default=True)


class OrchestratorPlanningRequest(BaseModel):
    macheria: MacheriaRequest = Field(default_factory=MacheriaRequest)
    line: LinePlanRequest | None = None
    include_llm: bool = Field(default=True)


class OrchestratorReactiveRequest(BaseModel):
    maintenance: MaintenanceIncidentRequest
    macheria: MacheriaRequest = Field(default_factory=MacheriaRequest)
    include_llm: bool = Field(default=True)


class LLMSummary(BaseModel):
    enabled: bool
    provider: str
    model: str | None = None
    content: str | None = None
    error: str | None = None


class FusionStep(BaseModel):
    order_id: int
    referencia: str
    metal_id: str
    cantidad_total: int
    fecha_entrega: datetime | str
    transition_minutes: int
    transition_energy: float
    transition_score: float


class AgentEnvelope(BaseModel):
    agent: str
    mode: Literal["rules-only", "hybrid"]
    data: dict
    llm: LLMSummary | None = None
