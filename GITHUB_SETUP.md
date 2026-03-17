# 🚀 Instrucciones para Subir a GitHub

## Paso 1: Crear el Repositorio en GitHub

1. Ve a https://github.com/orgs/universidad-europea-valencia/repositories
2. Haz clic en **"New repository"**
3. Completa los campos:
   - **Repository name**: `tfm-manufacturing-intelligence` (o el nombre que prefieras)
   - **Description**: `Manufacturing Intelligence System - Hybrid AI with FastAPI, React, and Multi-Agent Orchestration`
   - **Visibility**: Private (recomendado para trabajo académico)
   - **README**: NO inicialices con README (ya tenemos uno)
   - **.gitignore**: NO inicialices (ya tenemos .gitignore)
4. Haz clic en **"Create repository"**

## Paso 2: Configurar Credenciales de GitHub

### Opción A: Token de Acceso Personal (PAT) - RECOMENDADO

1. Ve a https://github.com/settings/tokens/new
2. Crea un nuevo Classic token con estos permisos:
   - ✅ `repo` (acceso completo a repositorios)
   - ✅ `workflow` (para GitHub Actions si lo necesitas)
3. **Copia el token** (no lo pierdes de vista)
4. Guarda el token de forma segura

### Opción B: SSH (Alternativa segura)

Si prefieres SSH:
```powershell
# Generar clave SSH
ssh-keygen -t ed25519 -C "tu-email@ues.edu.es"

# Agregar a ssh-agent (Windows)
# Sigue: https://docs.github.com/es/authentication/connecting-to-github-with-ssh
```

## Paso 3: Configurar Git con Credenciales

### Con PAT (Personal Access Token):

```powershell
# Ir a la carpeta del proyecto
cd "C:\Users\wisto\Desktop\Carpeta de archivos\MASTER IA\8.IA generativa con sistemas propietarios\PruebaTFM"

# Configurar credenciales globales (una sola vez)
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@ues.edu.es"

# Guardar credenciales en Windows Credential Manager
# (Git te pedirá el PAT como contraseña la primera vez)
git config --global credential.helper wincred
```

### Con SSH:

```powershell
# Agregar la clave pública a GitHub:
# 1. Ve a https://github.com/settings/keys
# 2. Haz clic en "New SSH key"
# 3. Pega tu clave pública (contenido de ~/.ssh/id_ed25519.pub)

# Probar conexión
ssh -T git@github.com
```

## Paso 4: Agregar Remote y Hacer Push

### Reemplaza `USERNAME` y `REPO_NAME` con tus valores:

```powershell
# Ir a la carpeta del proyecto
cd "C:\Users\wisto\Desktop\Carpeta de archivos\MASTER IA\8.IA generativa con sistemas propietarios\PruebaTFM"

# Agregar remote (HTTPS con PAT)
git remote add origin https://github.com/universidad-europea-valencia/tfm-manufacturing-intelligence.git

# O si usas SSH:
# git remote add origin git@github.com:universidad-europea-valencia/tfm-manufacturing-intelligence.git

# Verificar que el remote está configurado
git remote -v

# Hacer push del código (esto puede tomar un momento)
git branch -M main
git push -u origin main
```

## Paso 5: Verificar en GitHub

1. Ve a https://github.com/universidad-europea-valencia/tfm-manufacturing-intelligence
2. Verifica que aparecen todos los archivos
3. Comprueba que el commit está en el historio

## 📝 Futuros Commits

Cada vez que hagas cambios:

```powershell
# Ver cambios
git status

# Agregar cambios
git add .

# Crear commit
git commit -m "Descripción del cambio"

# Hacer push
git push origin main
```

## 🔧 Troubleshooting

### Error: "fatal: Could not read from remote repository"

- Verifica que el remote está bien configurado: `git remote -v`
- Si usas PAT, asegúrate de que aún es válido
- Si usas SSH, comprueba que la clave está agregada a ssh-agent

### El Usuario/Política de Seguridad no está permitido

- Algunos ajustes de seguridad de GitHub pueden bloquearte
- Pide acceso al admin de la organización

### Conflictos de Línea (CRLF vs LF)

Git ya lo maneja automáticamente con nuestro `.gitignore`

---

## 📚 Recursos

- [GitHub Docs - Autenticación](https://docs.github.com/es/authentication)
- [GitHub Docs - SSH Keys](https://docs.github.com/es/authentication/connecting-to-github-with-ssh)
- [Git Configuration](https://git-scm.com/book/es/v2/Primeros-pasos-Configuraci%C3%B3n-de-Git)
