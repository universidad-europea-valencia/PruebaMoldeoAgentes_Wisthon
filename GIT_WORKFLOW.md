# 🔄 Git Workflow - Guía de Commits

## 📍 Estado Actual

- **Repositorio**: `universidad-europea-valencia/PruebaMoldeoAgentes_Wisthon`
- **Rama Principal**: `main`
- **Remote**: `origin` → `https://github.com/universidad-europea-valencia/PruebaMoldeoAgentes_Wisthon.git`

## ✅ Commits Subidos a GitHub

```
2382203 (HEAD -> main) merge: resolve README conflict, keep local version
c872d11 Initial commit
a3313a6 docs: Add GitHub setup instructions for repository and credential configuration
1b7734f Initial commit: Manufacturing Intelligence System architecture and documentation
```

## 📝 Convención de Commits

Usamos **Conventional Commits** para mantener el historial limpio:

```
<tipo>(<ámbito>): <descripción breve>

<cuerpo opcional>
<footer opcional>
```

### Tipos de Commits

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| **feat** | Nueva funcionalidad | `feat(agents): Add orchestrator logic` |
| **fix** | Corrección de bugs | `fix(database): Resolve connection timeout` |
| **docs** | Documentación | `docs(api): Update endpoint reference` |
| **style** | Formato, espacios, etc. | `style(frontend): Format code with prettier` |
| **refactor** | Refactorización sin cambiar comportamiento | `refactor(agents): Simplify agent initialization` |
| **perf** | Mejoras de performance | `perf(api): Optimize query performance` |
| **test** | Tests y validaciones | `test(agents): Add unit tests for fusion agent` |
| **chore** | Tareas de mantenimiento | `chore(deps): Update dependencies` |
| **ci** | Cambios CI/CD | `ci: Add GitHub Actions workflow` |

### Ejemplos Correctos

```bash
feat(frontend): Add real-time dashboard with WebSocket support
fix(api): Resolve MySQL connection pool issue
docs(architecture): Update system diagram and components
test(agents): Add comprehensive test suite for all agents
refactor(backend): Extract common logic into utilities
perf(database): Add indexes to production queries
```

## 🚀 Flujo Típico de Trabajo

### 1. Verifica cambios pendientes
```powershell
cd "C:\Users\wisto\Desktop\Carpeta de archivos\MASTER IA\8.IA generativa con sistemas propietarios\PruebaTFM"
git status
```

### 2. Agregar cambios
```powershell
# Agregar todos los cambios
git add .

# O agregar archivos específicos
git add app/agents/fusion_agent.py
git add frontend/src/components/Dashboard.jsx
```

### 3. Crear commit
```powershell
git commit -m "feat(agents): Implement fusion agent logic"

# Para commits más complejos con descripción
git commit -m "feat(agents): Implement fusion agent logic

- Integrates data from multiple sources
- Applies ML models for anomaly detection
- Supports real-time updates via WebSocket"
```

### 4. Hacer push
```powershell
git push origin main
```

## 📊 Ejemplos de Commits por Componente

### Backend (FastAPI)
```bash
feat(api): Add endpoint for agent query
fix(database): Resolve transaction isolation issue
test(agents): Add integration tests for maintenance agent
```

### Frontend (React)
```bash
feat(frontend): Implement real-time data refresh
fix(ui): Resolve responsive layout on mobile
style(components): Apply Tailwind styling consistency
```

### Docker/Infraestructura
```bash
fix(docker): Update MySQL configuration for production
chore(deps): Upgrade FastAPI to 0.120.0
ci: Add automated testing workflow
```

### Documentación
```bash
docs(api): Add OpenAPI schema documentation
docs(architecture): Update component diagrams
docs(setup): Add system requirements
```

## 🔗 Ver Historial en GitHub

Ve a: https://github.com/universidad-europea-valencia/PruebaMoldeoAgentes_Wisthon/commits/main

## ⚡ Comandos Útiles

```powershell
# Ver cambios sin staged
git diff

# Ver cambios staged
git diff --staged

# Ver historial local
git log --oneline -10

# Ver cambios de un commit específico
git show 2382203

# Deshacer último commit (mantener cambios)
git reset --soft HEAD~1

# Deshacer cambios de un archivo
git checkout -- app/api.py

# Crear rama para experimental
git checkout -b feature/new-agent
git push -u origin feature/new-agent

# Cambiar a rama existente
git checkout main
git pull origin main
```

## 🚨 Problemas Comunes

### "Error: failed to push"
```powershell
# Primero haz pull para traer cambios remotos
git pull origin main
# Resuelve conflictos si los hay
# Luego intenta push nuevamente
git push origin main
```

### "Uncommitted changes"
```powershell
# Guarda cambios en stash
git stash

# O agrega y commitea
git add .
git commit -m "..."
```

### Conflictos de merge
```powershell
# Si hay conflictos, edita los archivos
# Marca como resueltos
git add <archivo>

# Completa el merge
git commit -m "merge: resolve conflicts"
```

## 📋 Checklist Antes de Push

- [ ] Tests pasando: `pytest` (backend)
- [ ] Linting correcto: `npm run lint` (frontend)
- [ ] Cambios testeados manualmente
- [ ] Commit message descriptivo
- [ ] Sin archivos no deseados (`.env`, `node_modules/`, etc.)
- [ ] Remote correcto: `git remote -v`

## 🔐 Seguridad

⚠️ **NUNCA** comitees:
- `.env` con credenciales reales
- `node_modules/` o `__pycache__/`
- Archivos sensibles (claves API, passwords)
- Binarios grandes

Estos están en `.gitignore` automáticamente.

---

**Próximo paso**: Cada cambio que hagas, crea un commit con mensaje descriptivo y haz push.
