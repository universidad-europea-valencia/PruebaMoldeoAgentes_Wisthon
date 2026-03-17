$ErrorActionPreference = "Stop"

if (-not (Test-Path ".venv\Scripts\python.exe")) {
    throw "No existe .venv. Ejecuta scripts/setup.ps1 primero."
}

$env:APP_HOST = "127.0.0.1"
$env:APP_PORT = "8000"

.\.venv\Scripts\python.exe -m uvicorn app.api:app --host $env:APP_HOST --port $env:APP_PORT
