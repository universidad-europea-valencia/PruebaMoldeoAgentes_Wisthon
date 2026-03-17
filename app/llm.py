from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from openai import AzureOpenAI, OpenAI

from app.config import Settings, get_settings


@dataclass(frozen=True)
class LLMResult:
    enabled: bool
    provider: str
    model: str | None
    content: str | None
    error: str | None = None


class LLMClient:
    def __init__(self, settings: Settings | None = None) -> None:
        self._settings = settings or get_settings()

    @property
    def enabled(self) -> bool:
        return bool(
            self._settings.llm_enabled
            and self._settings.llm_api_key
            and self._settings.llm_model
        )

    def health(self) -> dict[str, Any]:
        return {
            "enabled": self.enabled,
            "provider": self._settings.llm_provider,
            "model": self._settings.llm_model,
            "base_url": self._settings.llm_base_url,
        }

    def _build_client(self) -> OpenAI | AzureOpenAI:
        provider = self._settings.llm_provider.lower()
        if provider == "azure":
            if not self._settings.llm_base_url:
                raise ValueError("LLM_BASE_URL es obligatorio para Azure OpenAI.")
            return AzureOpenAI(
                api_key=self._settings.llm_api_key,
                api_version=self._settings.llm_api_version,
                azure_endpoint=self._settings.llm_base_url,
                timeout=self._settings.llm_timeout_seconds,
            )

        client_kwargs: dict[str, Any] = {
            "api_key": self._settings.llm_api_key,
            "timeout": self._settings.llm_timeout_seconds,
        }
        if self._settings.llm_base_url:
            client_kwargs["base_url"] = self._settings.llm_base_url
        return OpenAI(**client_kwargs)

    def generate_operational_advice(self, *, system_prompt: str, user_prompt: str) -> LLMResult:
        if not self.enabled:
            return LLMResult(
                enabled=False,
                provider=self._settings.llm_provider,
                model=self._settings.llm_model,
                content=None,
                error="LLM deshabilitado o sin credenciales.",
            )

        try:
            model = self._settings.llm_model
            if model is None:
                raise ValueError("LLM_MODEL no configurado.")

            client = self._build_client()
            response = client.chat.completions.create(
                model=model,
                temperature=0.1,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
            )
            content = response.choices[0].message.content if response.choices else None
            return LLMResult(
                enabled=True,
                provider=self._settings.llm_provider,
                model=self._settings.llm_model,
                content=content,
            )
        except Exception as exc:
            return LLMResult(
                enabled=True,
                provider=self._settings.llm_provider,
                model=self._settings.llm_model,
                content=None,
                error=str(exc),
            )
