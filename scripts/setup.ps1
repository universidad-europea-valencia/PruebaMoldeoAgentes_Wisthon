param(
    [string]$PythonExe = "python"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path ".venv")) {
    & $PythonExe -m venv .venv
}

$venvPython = ".venv\Scripts\python.exe"
& $venvPython -m pip install --upgrade pip
& $venvPython -m pip install -r requirements.txt

Write-Host "[OK] Entorno local preparado en .venv"
