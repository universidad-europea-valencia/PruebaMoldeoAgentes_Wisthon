from __future__ import annotations

import argparse
import sys

from app.agents.fusion_agent import FusionAgent
from app.database import init_schema, session_scope, test_connection


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Arranque de MAS-Foundry")
    parser.add_argument(
        "command",
        nargs="?",
        default="run",
        choices=["run", "init-db"],
        help="run: ejecuta agente de fusion, init-db: crea tablas en MySQL",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    try:
        test_connection()
    except Exception as exc:
        print(f"[ERROR] No se pudo conectar con MySQL: {exc}")
        return 1

    if args.command == "init-db":
        init_schema()
        print("[OK] Esquema MySQL inicializado desde SQLAlchemy.")
        return 0

    with session_scope() as session:
        fusion_agent = FusionAgent(session)
        result = fusion_agent.run(include_llm=False)

    plan = result["data"]["plan"]
    if not plan:
        print("[INFO] No hay ordenes de produccion para planificar.")
        return 0

    print("[OK] Plan de Fusion generado:")
    for step in plan:
        print(
            " - Orden {order_id} ({referencia}) | Metal: {metal_id} | "
            "Transicion: {transition_minutes} min | Score: {transition_score:.2f}".format(**step)
        )

    summary = result["data"]["summary"]
    print(
        "[OK] Resumen | Ordenes: {total_orders} | Secuencia: {sequence} | "
        "Tiempo transicion: {total_transition_minutes} min".format(**summary)
    )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
