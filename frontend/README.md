# Manufacturing AI Frontend

Frontend profesional y moderno para el sistema de Manufacturing Intelligence con IA híbrida.

## 🎯 Características

### Dashboard Principal
- Métricas clave de producción en tiempo real
- Gráficos de evolución de producción (target vs. actual)
- Distribución de calidad (Pareto)
- Estado de máquinas con indicadores de uptime
- Alertas activas de operación

### Módulos Especializados

#### 🔨 Agente de Fusión
- Optimización de secuencia de metales
- Minimización de costos de transición
- Análisis de riesgos metalúrgicos
- Recomendaciones con IA

#### ⚙️ Agente de Machería
- Análisis de cuello de botella en producción de machos
- Cálculo de capacidad de máquinas
- Detección de horas hasta rotura de stock
- Recomendaciones operativas

#### 📈 Agente de Línea
- Planificación de tiempos por orden
- Secuenciación de modelos
- Detección de cambios costosos
- Análisis de disponibilidad de línea

#### ✓ Agente de Calidad
- Cálculo de reabastecimiento por scrap
- Fórmula: N_new = N_target / (1 - R_scrap)
- Impacto de calidad en planificación
- Recomendaciones de acción

#### 🔧 Agente de Mantenimiento
- Gestión de incidentes de máquinas
- Detección de rutas afectadas
- Rerouting automático de órdenes
- Eskalación y mitigación

#### ⚡ Orquestador
- Ejecución de workflows completos
- Modo Planning: Fusión → Machería → Línea
- Modo Reactive: Mantenimiento → Replanificación
- Análisis consolidado con IA

## 🚀 Instalación

### Requisitos Previos
- Node.js >= 16
- npm >= 8
- Backend de FastAPI corriendo en `http://localhost:8001`

### Pasos de Instalación

```bash
# Navegar a la carpeta frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación se iniciará en `http://localhost:3000`

## 📦 Stack Tecnológico

- **React 18** - Framework UI
- **Vite 5** - Build tool moderno
- **Tailwind CSS** - Styling utilities
- **Recharts** - Gráficos y visualizaciones
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos profesionales
- **date-fns** - Manipulación de fechas

## 🏗️ Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx       # Dashboard principal
│   │   ├── Fusion.jsx          # Módulo Fusión
│   │   ├── Macheria.jsx        # Módulo Machería
│   │   ├── Linea.jsx           # Módulo Línea
│   │   ├── Calidad.jsx         # Módulo Calidad
│   │   ├── Mantenimiento.jsx   # Módulo Mantenimiento
│   │   ├── Orchestrator.jsx    # Orquestador
│   │   └── Shared.jsx          # Componentes reutilizables
│   ├── services/
│   │   └── api.js              # Cliente API
│   ├── App.jsx                 # Componente principal
│   ├── App.css                 # Estilos globales
│   ├── index.css               # Tailwind + custom styles
│   └── main.jsx                # Punto de entrada
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🎨 Componentes Compartidos

### Componentes UI
- `Card` - Contenedor de contenido
- `CardHeader` - Encabezado de tarjeta con título e ícono
- `MetricCard` - Tarjeta de métrica con estado
- `StatusBadge` - Badge de estado
- `Button` - Botones con variantes
- `Input` - Campo de entrada
- `Select` - Select personalizado
- `FormGroup` - Grupo de formulario con label y error

### Componentes de Feedback
- `LoadingSpinner` - Indicador de carga
- `ErrorMessage` - Mensaje de error
- `SuccessMessage` - Mensaje de éxito
- `JSONViewer` - Visualizador de JSON

## 🔌 Integración con API

El cliente API está configurado para conectarse automáticamente al backend en `http://localhost:8001`.

### Endpoints Soportados

```javascript
// Fusion Agent
POST /fusion/plan

// Macheria Agent
POST /macheria/analyze

// Linea Agent
POST /linea/plan

// Calidad Agent
POST /calidad/replenish

// Mantenimiento Agent
POST /mantenimiento/incident

// Orchestrator
POST /orchestrator/planning
POST /orchestrator/reactive
```

Todos los endpoints aceptan parámetro `include_llm: true/false` para habilitar/deshabilitar recomendaciones con IA.

## 🎛️ Funcionalidades Principales

### 1. Interfaz Responsive
- Sidebar colapsable
- Diseño mobile-friendly
- Temas claros y accesibles

### 2. Visualización de Datos
- Gráficos de barras y líneas con Recharts
- Gráficos de pastel (distribución)
- Tablas iterativas
- Indicadores de estado color-codificados

### 3. Formularios Interactivos
- Validación en tiempo real
- Mensajes de error descriptivos
- Campos específicos por agente
- Opciones para habilitar/deshabilitar LLM

### 4. Monitoreo en Tiempo Real
- Métricas actualizables
- Estados de máquinas
- Alertas y notificaciones
- Histórico de ejecuciones

## 🛠️ Desarrollo

### Scripts Disponibles

```bash
# Inicia servidor de desarrollo
npm run dev

# Compila para producción
npm run build

# Vista previa de build
npm run preview
```

### Variables de Entorno

Crear archivo `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8001
```

## 📊 Ejemplo de Uso

### 1. Dashboard
- Navegar a la pestaña "Dashboard"
- Visualizar métricas globales
- Identificar alertas críticas

### 2. Planning (Orquestador)
- Click en "⚡ Orquestador"
- Click en "📋 Ejecutar Planning"
- Observar ejecución de Fusión → Machería → Línea
- Revisar recomendaciones si LLM está habilitada

### 3. Análisis de Machería
- Click en "⚙️ Machería"
- Ajustar parámetros de capacidad
- Click en "Analizar Capacidad"
- Revisar bottleneck y horas hasta colapso

### 4. Manejo de Incidentes
- Click en "🔧 Mantenimiento"
- Seleccionar máquina y estado
- Click en "Registrar Incidente"
- Verificar rerouting automático

## 🔒 Seguridad

- No se almacenan credenciales en el frontend
- Las credenciales LLM permanecen en el backend
- CORS configurado para API segura
- HTTPS recomendado en producción

## 📝 Notas

- El sistema está optimizado para desktop y tablet
- Mobile view es funcional pero recomendado para tablets
- Requiere conexión activa con backend FastAPI
- Máximo timeout de API: 30 segundos

## 🤝 Contribuir

Para mejorar el frontend:
1. Crear nueva rama
2. Realizar cambios
3. Testear en localhost
4. Submeter PR con descripción

## 📄 Licencia

Copyright © 2026 - Manufacturing AI System

---

**Desarrollado con ❤️ para Manufacturing Intelligence**
