# Setup, Arquitectura y Seguridad (Estado Final)

## 1) Pasos realizados (en orden)
1. Se implemento la base Python con paquete `app`, conexion MySQL y modelos ORM.
2. Se creo el Agente de Fusion con optimizacion de transiciones metalurgicas.
3. Se convirtio el Agente de Fusion en hibrido: reglas deterministas + explicacion LLM opcional.
4. Se implementaron los otros agentes del documento:
    - Macheria
    - Linea
    - Calidad
    - Mantenimiento
    - Orquestador
5. Se agrego una capa LLM real configurable por entorno en `app/llm.py`.
6. Se ampliaron los endpoints FastAPI para exponer cada agente y los workflows planning/reactive.
7. Se actualizaron `requirements.txt`, `.env` y `.env.example` para soportar proveedor LLM real.
8. Se ampliaron los datos semilla MySQL con maquinas adicionales para macheria y acabados alternativos.
9. Se mantuvo despliegue local y Docker con endurecimiento basico de seguridad.
10. Se genero documentacion especifica de arquitectura hibrida en `HYBRID_AI_ARCHITECTURE.md`.

## 2) Arquitectura final de la app
### 2.1 Componentes de runtime
- **fusion-agent (contenedor app)**
   - FastAPI + SQLAlchemy.
   - Agentes de negocio bajo `app/agents`.
   - Capa LLM opcional mediante `app/llm.py`.
   - CLI en `main.py`.
- **mysql (contenedor DB)**
   - MySQL 8.4.
   - Bootstrap SQL en `docker/mysql/init`.
   - Red interna `internal_net`.

### 2.2 Agentes disponibles
- `POST /fusion/plan`
- `POST /macheria/analyze`
- `POST /linea/plan`
- `POST /calidad/replenish`
- `POST /mantenimiento/incident`
- `POST /orchestrator/planning`
- `POST /orchestrator/reactive`
- `GET /health`
- `GET /llm/health`

### 2.3 Patron de ejecucion
1. La API recibe la peticion.
2. Se abre sesion contra MySQL cuando aplica.
3. El agente ejecuta su logica determinista.
4. Si `include_llm=true` y el proveedor esta configurado, se solicita una explicacion/recomendacion al modelo.
5. La respuesta devuelve dos capas:
    - `data`: salida auditada por reglas.
    - `llm`: enriquecimiento textual del modelo.

### 2.4 Que va por reglas y que va por LLM
- Reglas:
   - secuenciacion de metales
   - cuello de botella de macheria
   - calculo de tiempos de linea
   - formula de scrap
   - rerouting de mantenimiento
   - orquestacion de workflows
- LLM:
   - explicacion del plan
   - resumen ejecutivo
   - recomendacion operativa
   - priorizacion de riesgos

## 3) Donde debes intervenir para finalizar configuraciones
### 3.1 Credenciales y secretos obligatorios
Editar `.env`:
- `MYSQL_PASSWORD`
- `MYSQL_ROOT_PASSWORD`

Si vas a activar IA real, editar tambien:
- `LLM_ENABLED=true`
- `LLM_PROVIDER=openai` o `azure`
- `LLM_MODEL`
- `LLM_API_KEY`
- `LLM_BASE_URL` si usas Azure o endpoint compatible
- `LLM_API_VERSION` para Azure si aplica

### 3.2 Parametros por entorno
En `.env`:
- `APP_ENV=prod` en produccion
- `SQL_ECHO=false` fuera de desarrollo
- `MYSQL_HOST=mysql` en Docker
- `MYSQL_HOST=localhost` si tu DB corre fuera del compose

### 3.3 Datos iniciales
Si no quieres seed automatico:
- modificar o retirar `docker/mysql/init/02_seed_test_data.sql`

### 3.4 Acceso y exposicion
Actualmente solo se expone el puerto HTTP `8000`.
MySQL no se expone hacia fuera, lo cual es la opcion correcta por defecto.

## 4) Seguridad aplicada
1. Contenedor app sin root.
2. Filesystem read-only en contenedor app.
3. `cap_drop: [ALL]`.
4. `no-new-privileges:true`.
5. Red privada entre app y DB.
6. Secretos fuera del codigo y fuera de git.
7. Dependencia de arranque contra MySQL saludable.
8. El LLM nunca decide escrituras directas ni cambios de estado sin reglas de negocio.
9. Si el LLM cae o no esta configurado, la app sigue operando en modo `rules-only`.

## 5) Comandos de uso
### 5.1 Local
1. `powershell -ExecutionPolicy Bypass -File scripts/setup.ps1`
2. Ajustar `.env`
3. `python main.py init-db`
4. `python main.py run`
5. API local: `powershell -ExecutionPolicy Bypass -File scripts/run_local.ps1`

### 5.2 Docker
1. Ajustar `.env`
2. `docker compose up --build -d`
3. `curl http://localhost:8000/health`
4. `curl http://localhost:8000/llm/health`
5. `curl -X POST http://localhost:8000/fusion/plan -H "Content-Type: application/json" -d "{\"include_llm\": true}"`

## 6) Checklist final recomendado
- [ ] Contraseñas reales y fuertes en `.env`
- [ ] Clave LLM real si quieres modo hibrido
- [ ] Sin puerto MySQL publicado
- [ ] Backup del volumen `mysql_data`
- [ ] Logs y monitorizacion en destino
- [ ] Rotacion de secretos definida
- [ ] Validar que el proveedor LLM permitido cumple tus requisitos de seguridad y privacidad
