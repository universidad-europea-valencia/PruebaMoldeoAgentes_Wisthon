# MAS-Foundry: Sistema Multi-Agente de Planificación Metalúrgica

## Objetivo
Desarrollar un sistema de planificación de producción reactivo para una fundición de automoción utilizando una arquitectura de micro-agentes en Python y MySQL.

## Stack Tecnológico (Sistema Abierto)
- **Lenguaje:** Python 3.11+
- **Base de Datos:** MySQL 8.0
- **Optimizador:** Google OR-Tools (CP-SAT Solver)
- **Agentes:** FastAPI (Comunicación) + Clases asíncronas
- **Dashboard:** Streamlit

## Instrucciones para el Asistente de Código
1. **Fase 1:** Crear el esquema de base de datos MySQL basado en `DATABASE.md`.
2. **Fase 2:** Implementar la lógica de los 7 agentes definidos en `ARCHITECTURE.md`.
3. **Fase 3:** Desarrollar el motor de optimización (Solver) que gestione las restricciones de metalurgia y machería.
4. **Fase 4:** Crear el dashboard de control reactivo.

**RESTRICCIÓN CRÍTICA:** El sistema debe ser capaz de re-planificar en menos de 5 segundos ante una avería o un reporte de rechazo (scrap) superior al previsto.