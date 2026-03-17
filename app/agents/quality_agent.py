from __future__ import annotations

from app.llm import LLMClient, LLMResult


class QualityAgent:
    """Scrap Manager: recalcula lote objetivo ante rechazo."""

    def __init__(self, llm_client: LLMClient | None = None) -> None:
        self._llm_client = llm_client or LLMClient()

    def replenish(self, *, target_quantity: int, scrap_rate: float, include_llm: bool) -> dict:
        replenished_quantity = int(round(target_quantity / (1.0 - scrap_rate)))
        extra_units = replenished_quantity - target_quantity

        data = {
            "target_quantity": target_quantity,
            "scrap_rate": scrap_rate,
            "replenished_quantity": replenished_quantity,
            "extra_units": extra_units,
            "formula": "N_new = N_target / (1 - R_scrap)",
        }

        llm_result = self._advise(data) if include_llm else self._disabled_llm()
        return {
            "agent": "calidad",
            "mode": "hybrid" if include_llm else "rules-only",
            "data": data,
            "llm": self._serialize_llm(llm_result),
        }

    def _advise(self, data: dict) -> LLMResult:
        return self._llm_client.generate_operational_advice(
            system_prompt=(
                "Eres responsable de calidad industrial. Explica el impacto del scrap y la accion "
                "de reaprovisionamiento en no mas de 4 frases."
            ),
            user_prompt=f"Situacion de scrap: {data}",
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
