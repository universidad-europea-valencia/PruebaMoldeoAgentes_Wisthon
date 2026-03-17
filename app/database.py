from __future__ import annotations

from contextlib import contextmanager
from functools import lru_cache
from typing import Iterator

from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker

from app.config import get_settings
from app.models import Base


@lru_cache(maxsize=1)
def get_engine():
    settings = get_settings()
    return create_engine(
        settings.database_url,
        echo=settings.sql_echo,
        pool_pre_ping=True,
        future=True,
    )


@lru_cache(maxsize=1)
def get_session_factory() -> sessionmaker[Session]:
    return sessionmaker(bind=get_engine(), autoflush=False, autocommit=False, future=True)


@contextmanager
def session_scope() -> Iterator[Session]:
    session = get_session_factory()()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def test_connection() -> bool:
    with get_engine().connect() as connection:
        connection.execute(text("SELECT 1"))
    return True


def init_schema() -> None:
    Base.metadata.create_all(bind=get_engine())
