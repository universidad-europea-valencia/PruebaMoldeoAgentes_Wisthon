#!/bin/sh
set -e

echo "[startup] Esperando a MySQL en ${MYSQL_HOST}:${MYSQL_PORT}..."
python -c "from app.database import test_connection; test_connection()"

echo "[startup] Inicializando esquema (idempotente)..."
python main.py init-db

echo "[startup] Levantando API..."
exec uvicorn app.api:app --host ${APP_HOST:-0.0.0.0} --port ${APP_PORT:-8000}
