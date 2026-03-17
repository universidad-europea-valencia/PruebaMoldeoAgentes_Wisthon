from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache
from urllib.parse import quote_plus

from dotenv import load_dotenv


load_dotenv()


@dataclass(frozen=True)
class Settings:
    app_name: str = os.getenv("APP_NAME", "MAS-Foundry")
    app_env: str = os.getenv("APP_ENV", "dev")
    app_host: str = os.getenv("APP_HOST", "0.0.0.0")
    app_port: int = int(os.getenv("APP_PORT", "8000"))
    llm_enabled: bool = os.getenv("LLM_ENABLED", "false").lower() in {"1", "true", "yes"}
    llm_provider: str = os.getenv("LLM_PROVIDER", "openai")
    llm_model: str | None = os.getenv("LLM_MODEL")
    llm_api_key: str | None = os.getenv("LLM_API_KEY")
    llm_base_url: str | None = os.getenv("LLM_BASE_URL")
    llm_api_version: str = os.getenv("LLM_API_VERSION", "2024-10-21")
    llm_timeout_seconds: float = float(os.getenv("LLM_TIMEOUT_SECONDS", "20"))
    mysql_host: str = os.getenv("MYSQL_HOST", "localhost")
    mysql_port: int = int(os.getenv("MYSQL_PORT", "3306"))
    mysql_user: str = os.getenv("MYSQL_USER", "root")
    mysql_password: str = os.getenv("MYSQL_PASSWORD", "")
    mysql_database: str = os.getenv("MYSQL_DATABASE", "mas_foundry")
    sql_echo: bool = os.getenv("SQL_ECHO", "false").lower() in {"1", "true", "yes"}

    @property
    def database_url(self) -> str:
        encoded_password = quote_plus(self.mysql_password)
        return (
            "mysql+pymysql://"
            f"{self.mysql_user}:{encoded_password}@"
            f"{self.mysql_host}:{self.mysql_port}/{self.mysql_database}"
        )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
