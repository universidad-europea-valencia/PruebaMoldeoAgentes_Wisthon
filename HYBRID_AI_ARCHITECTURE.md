# Arquitectura Hibrida de Agentes IA

## Objetivo
Diseñar un sistema multiagente industrial en el que las decisiones operativas criticas sean deterministas y auditables, mientras que el LLM aporte interpretacion, explicaciones, priorizacion de riesgos y apoyo a la replanificacion.

## Principio de diseno
- **Reglas y optimizacion**: decisiones duras de secuenciacion, calculo de lotes, cambios de ruta, validacion de estados y limites operativos.
- **LLM**: explicacion contextual, resumen ejecutivo, deteccion de riesgos textuales, recomendaciones y narrativas para operador/supervisor.
- **Nunca** se delegan al LLM credenciales, escrituras directas en base de datos ni cambios de estado sin pasar por logica de negocio.

## Mapa de agentes
### 1. Agente de Fusion
- Reglas:
  - Lee `ordenes_produccion`, `materiales` y `matriz_transicion`.
  - Optimiza la secuencia de metales minimizando coste de transicion.
  - Aplica regla metalurgica fallback Ferritico -> Perlitico bajo coste, inversa alto coste.
- LLM:
  - Explica por que la secuencia es razonable.
  - Resume riesgo metalurgico principal.
  - Propone recomendacion operativa para supervisor.
- Endpoint:
  - `POST /fusion/plan`

### 2. Agente de Macheria
- Reglas:
  - Cuenta maquinas de macheria operativas.
  - Calcula capacidad total de fabricacion de machos.
  - Detecta horas hasta rotura de stock.
  - Recomienda cambiar a piezas sin macho cuando el buffer cae por debajo del umbral.
- LLM:
  - Resume criticidad del cuello de botella.
  - Sugiere prioridad operativa y mensaje para sala de control.
- Endpoint:
  - `POST /macheria/analyze`

### 3. Agente de Linea
- Reglas:
  - Calcula tiempos por orden segun ciclos y cambios de modelo.
  - Acumula carga y detecta disponibilidad de linea.
- LLM:
  - Resume secuencia de trabajo.
  - Señala cambios de modelo costosos y propuestas de agrupacion.
- Endpoint:
  - `POST /linea/plan`

### 4. Agente de Calidad
- Reglas:
  - Aplica $N_{new} = \frac{N_{target}}{1 - R_{scrap}}$.
  - Calcula piezas extra necesarias.
- LLM:
  - Traduce el impacto del scrap a accion operativa.
  - Prioriza urgencia y mensaje para planificacion.
- Endpoint:
  - `POST /calidad/replenish`

### 5. Agente de Mantenimiento
- Reglas:
  - Actualiza estado de maquina.
  - Detecta ruta afectada por la averia.
  - Reencamina ordenes a ruta alternativa (`CNC -> Manual`, `Robot -> CNC`, etc.).
- LLM:
  - Resume impacto del incidente.
  - Sugiere mensaje de escalado y mitigacion inmediata.
- Endpoint:
  - `POST /mantenimiento/incident`

### 6. Orquestador
- Reglas:
  - Encadena workflows de planning y reactive.
  - Ejecuta Fusion -> Macheria -> Linea en planning.
  - Ejecuta Mantenimiento -> Replanificacion en reactive.
- LLM:
  - En esta version el LLM entra por cada agente; el orquestador consume la salida ya enriquecida.
- Endpoints:
  - `POST /orchestrator/planning`
  - `POST /orchestrator/reactive`

## Conectividad LLM real
La app ya soporta conexion a proveedor LLM real via variables de entorno:
- `LLM_ENABLED`
- `LLM_PROVIDER` (`openai` o `azure`)
- `LLM_MODEL`
- `LLM_API_KEY`
- `LLM_BASE_URL`
- `LLM_API_VERSION`
- `LLM_TIMEOUT_SECONDS`

Implementacion actual:
- Cliente en `app/llm.py`.
- Integracion segura con SDK `openai`.
- Si no hay credenciales o el LLM esta deshabilitado, la app sigue funcionando en `rules-only`.

## Flujo de datos
1. Cliente llama a FastAPI.
2. API abre sesion SQLAlchemy.
3. Agente ejecuta logica determinista contra MySQL o payload.
4. Si `include_llm=true` y el proveedor esta configurado, se envia solo contexto operativo minimo al LLM.
5. Se devuelve respuesta con dos bloques:
   - `data`: resultado auditado por reglas.
   - `llm`: recomendacion o explicacion textual.

## Seguridad de la capa LLM
- Las claves LLM solo viven en variables de entorno.
- No se envian secretos, cadenas de conexion ni datos de sistema al modelo.
- Los cambios de estado en DB nunca dependen de la respuesta del LLM.
- El contenedor app sigue sin root y con filesystem read-only.
- La app puede operar completamente sin LLM en caso de caida del proveedor.

## Arquitectura final de runtime
- `mysql`: persistencia operativa.
- `fusion-agent`:
  - FastAPI
  - SQLAlchemy
  - capa LLM opcional
  - agentes de negocio
  - orquestador

## Evolucion recomendada
1. Añadir tablas de eventos, scrap historico y telemetria real de planta.
2. Añadir solver OR-Tools para Gantt final y restricciones cruzadas.
3. Separar cada agente en microservicio si el volumen operativo lo exige.
4. Añadir autenticacion API, rate limiting y auditoria de prompts/respuestas.
