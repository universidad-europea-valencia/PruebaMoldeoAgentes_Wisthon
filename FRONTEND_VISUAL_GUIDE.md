# 🎬 Frontend Manufacturing AI - Guía Visual y Ejemplos

## 📺 Vista General del Frontend

```
┌─────────────────────────────────────────────────────────────┐
│  Manufacturing AI System             🟢 API Connected        │
└─────────────────────────────────────────────────────────────┘
┌──────────────────┬─────────────────────────────────────────┐
│                  │                                         │
│  SIDEBAR         │          MAIN CONTENT AREA              │
│  (Collapsible)   │                                         │
│                  │    Dashboard / Modules                  │
│  ☰ Cerrar        │    (Scrollable)                         │
│                  │                                         │
│  📊 Dashboard    │    [Content dinamico segun modulo]      │
│  ⚡ Orquestador  │                                         │
│  🔨 Fusión       │                                         │
│  ⚙️ Machería     │                                         │
│  📈 Línea        │                                         │
│  ✓ Calidad       │                                         │
│  🔧 Mantenimiento│                                         │
│                  │                                         │
│ ─────────────────┼─────────────────────────────────────────│
│ 🟢 Conectado     │                                         │
│ localhost:8001   │                                         │
└──────────────────┴─────────────────────────────────────────┘
```

---

## 📊 Dashboard

### KPI Cards (Top)
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Tasa Produc.   │  │  Calidad        │  │  Disponibilidad │  │  Órdenes        │
│      94.3%      │  │      92.0%      │  │      98.2%      │  │       24        │
│   (🟢 Success)  │  │   (🟢 Success)  │  │   (🟢 Success)  │  │   (Normal)      │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Status Cards (Middle)
```
┌──────────────────────────┐  ┌──────────────────────────┐  ┌──────────────────────────┐
│ Estado de Machería       │  │ Planificación            │  │ Agentes Activos          │
│      🔴 Crítico          │  │      ✓ Actualizada       │  │      6/6 ✓               │
│ 4.2 horas al colapso     │  │ Hace 5 min               │  │ Todos operativos         │
└──────────────────────────┘  └──────────────────────────┘  └──────────────────────────┘
```

### Charts
```
Producción (Last 24h)          Calidad (Últimas 1000)       Máquinas
                               
100│ ██ ██ ██ ░░ ██ ██         Buenas 92% ████████          CNC_1: ████████ 99.2%
   │ ██ ██ ██ ██ ██ ██                       
 50│ ██ ██ ██ ██ ██ ██         Scrap  8%  █                CNC_2: ███████  98.5%
   │ ██ ██ ██ ██ ██ ██                       
   └─────────────────                       Robot_1: █████████ 99.8%
     00 04 08 12 16 20
     (Target vs Actual)                     Manual_1: ██████   95.3%
```

---

## ⚡ Orquestador

### Interfaz Planning
```
╔═══════════════════════════════════════════════════╗
║ Orquestador de Agentes                            ║
║ Ejecutar workflows completos: planning y reactive  ║
╚═══════════════════════════════════════════════════╝

☐ Incluir recomendaciones con IA en todos los agentes

┌──────────────────────────────┐  ┌──────────────────────────────┐
│   📋 Ejecutar Planning       │  │  ⚡ Ejecutar Reactive        │
│                              │  │                              │
│ Fusion → Machería → Línea    │  │ Maintenance → Replanning     │
└──────────────────────────────┘  └──────────────────────────────┘

ℹ️ Planning: Ejecuta Fusión → Machería → Línea en secuencia
ℹ️ Reactive: Ejecuta Mantenimiento → Replanificación
```

### Resultados Planning
```
╔═══════════════════════════════════════════════════╗
║ Resultado de Planning                             ║
║ Resumen de agentes ejecutados                    ║
╚═══════════════════════════════════════════════════╝

Resumen Ejecutivo
─────────────────────────────────────────────────
Optimización completada. Secuencia viable con
2.3% de transición metalúrgica y capacidad suficiente.

✓ Fusión (Metal sequence optimized)
✓ Machería (Bottleneck: 6.8 hours available)
✓ Línea (Line available: YES)

🔴 Problemas Críticos Detectados
─────────────────────────────────
• Stock núcleos bajo (<8 horas)
```

---

## 🔨 Fusión

### Formulario
```
╔═══════════════════════════════════════════════════╗
║ Agente de Fusión                                  ║
║ Optimización del cuello de botella                ║
╚═══════════════════════════════════════════════════╝

Órdenes de Producción
───────────────────
┌─────────────────────────────────────────────────┐
│ Orden #1  |  Ferrítico - 100 piezas            │
│ Orden #2  |  Perlítico - 150 piezas            │
│ Orden #3  |  Ferrítico - 80 piezas             │
└─────────────────────────────────────────────────┘

☐ Usar LLM para explicación y riesgos

┌──────────────────────────────────┐
│  🔨 Generar Plan de Fusión       │
└──────────────────────────────────┘
```

### Resultados
```
Plan de Fusión Optimizado
─────────────────────────

Ferrítico → Perlítico → Ferrítico
─────────────────────────────────────────────────
│ Ferrítico │        │ Perlítico │        │ Ferrítico │

Costo Total: 1250.00 € | Transiciones: 2 | Riesgo: BAJO
```

---

## ⚙️ Machería

### Formulario
```
╔═══════════════════════════════════════════════════╗
║ Análisis de Machería                              ║
║ Optimización del cuello de botella                ║
╚═══════════════════════════════════════════════════╝

Tasa moldeo (piezas/hora)     ║  Tasa núcleos/máquina (nuc/h)
┌──────────────┐              ║  ┌──────────────┐
│  300         │              ║  │  50          │
└──────────────┘              ║  └──────────────┘

Stock núcleos actual          ║  Horas de seguridad
┌──────────────┐              ║  ┌──────────────┐
│  200         │              ║  │  4           │
└──────────────┘              ║  └──────────────┘

Horizonte análisis (horas)    ║
┌──────────────┐              ║
│  8           │              ║
└──────────────┘              ║

☐ Usar LLM (Incluir recomendaciones)

┌──────────────────────────────────────┐
│  ⚙️ Analizar Capacidad               │
└──────────────────────────────────────┘
```

### Resultados
```
Resultados del Análisis
───────────────────────
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ Máquinas Op.     │  │ Capacidad Total  │  │ Horas a Rotura   │  │ Critical         │
│      2           │  │   100 units/h    │  │    4.2 hours     │  │ 🔴 SÍ - CRÍTICO  │
└──────────────────┘  └──────────────────┘  └──────────────────┘  └──────────────────┘

⚠️ Stock de núcleos alcanzará cero en 4.2 horas
Requiere acción inmediata para producción de piezas sin macho.
```

---

## ✓ Calidad

### Formulario
```
╔═══════════════════════════════════════════════════╗
║ Cálculo de Reabastecimiento por Calidad           ║
║ Determinar cantidad adicional necesaria           ║
╚═══════════════════════════════════════════════════╝

Cantidad objetivo (piezas)    ║  Tasa rechazo (%)
┌──────────────┐              ║  ┌──────────────┐
│  500         │              ║  │  8.0         │
└──────────────┘              ║  └──────────────┘

☐ Usar LLM para explicación

┌──────────────────────────────────────────┐
│  Calcular Reabastecimiento               │
└──────────────────────────────────────────┘
```

### Resultado
```
Resultados del Cálculo
─────────────────────
┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ Cantidad Obj.  │  │ Tasa Scrap     │  │ Piezas Adicionales  │ Nueva Total  │
│     500        │  │    8.00%       │  │      43             │    543       │
└────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘

Fórmula: N_new = 500 / (1 - 0.08) = 543 piezas

Impacto: Necesarias 43 piezas adicionales para compensar
8% de scrap y garantizar 500 piezas buenas.
```

---

## 🔧 Mantenimiento

### Formulario
```
╔═══════════════════════════════════════════════════╗
║ Gestión de Incidentes de Mantenimiento            ║
║ Actualizar estado de máquina y rerouting         ║
╚═══════════════════════════════════════════════════╝

Máquina                       ║  Nuevo Estado
┌──────────────────────────┐  ║  ┌──────────────────────────┐
│ ▼ CNC_1                │  ║  │ ▼ 🔴 Avería (Breakdown) │
└──────────────────────────┘  ║  └──────────────────────────┘

☐ Usar LLM para explicación

┌──────────────────────────────────────────┐
│  🔴 Registrar Incidente                  │
└──────────────────────────────────────────┘
```

### Resultado
```
Resultado del Incidente
──────────────────────
Máquina: CNC_1 │ Estado: 🔴 Avería

⚠️ Rutas Afectadas
──────────────────
• Ruta Principal (CNC)
• Lote B03 - 150 piezas
• Lote B04 - 80 piezas

✓ Rerouting Disponible
──────────────────────
Las órdenes serán automáticamente reasignadas
a máquinas alternativas (CNC_2, Manual_1).
```

---

## 📈 Línea

### Resultado Secuencia
```
Secuencia Planificada
─────────────────────

Paso 1: ModeloA
├─ 100 piezas × 5 min = 500 min
└─ Cambio: normal

Paso 2: ModeloB
├─ 150 piezas × 8 min = 1200 min
└─ Cambio: 🔴 expensive

Paso 3: ModeloA
├─ 80 piezas × 5 min = 400 min
└─ Cambio: normal

Carga Total: 28.33 horas
Línea Disponible: ✓ SÍ
Cambios Costosos: 1
```

---

## 📋 Componentes Compartidos

### Error Message
```
┌──────────────────────────────────────────────────┐
│ 🔴 Error                                      ✕ │
│ Error de conexión: No se pudo alcanzar la API  │
└──────────────────────────────────────────────────┘
```

### Success Message
```
┌──────────────────────────────────────────────────┐
│ ✓ Éxito                                       ✕ │
│ Análisis completado exitosamente              │
└──────────────────────────────────────────────────┘
```

### Loading Spinner
```
     🔄  (animado/girando)
   Procesando...
```

### Status Badges
```
🟢 Operativo    🟡 Advertencia    🔴 Error    ℹ️ Información
```

### JSON Viewer
```
{
  "data": {
    "machines_operative": 2,
    "total_core_capacity": 100,
    "hours_to_depletion": 4.2,
    "critical_bottleneck": true
  },
  "llm": {
    "reasoning": "...",
    "mitigating_actions": [...]
  }
}
```

---

## 🎯 Flujos de Usuario Típicos

### Flujo 1: Planificación Diaria
```
Usuario abre Dashboard
    ↓
Revisa KPIs (producción, calidad, máquinas)
    ↓
Ve alertas críticas → Stock de núcleos bajo
    ↓
Clica "⚡ Orquestador"
    ↓
Click "📋 Ejecutar Planning"
    ↓
Sistema ejecuta: Fusión → Machería → Línea
    ↓
Revisa resultados:
  • Secuencia optimizada (Fusión)
  • Bottleneck crítico en 4.2 hrs (Machería)
  • Carga disponible (Línea)
    ↓
Actúa: Aumenta producción o cambia a piezas sin macho
```

### Flujo 2: Incidente de Máquina
```
Alarma: CNC_1 falla
    ↓
Supervisor abre "🔧 Mantenimiento"
    ↓
Select: CNC_1, Estado: Avería
    ↓
Click: "Registrar Incidente"
    ↓
Sistema detecta:
  • Rutas impactadas: 2
  • Órdenes afectadas: 230 piezas
  • Rerouting: ✓ Disponible
    ↓
Órdenes automáticamente reasignadas a CNC_2 + Manual_1
    ↓
Sistema replica planificación
```

### Flujo 3: Análisis de Calidad
```
Proceso: Inspección revela 8% de scrap
    ↓
Abrir "✓ Calidad"
    ↓
Input: Target 500 piezas, Scrap 8%
    ↓
Click: "Calcular Reabastecimiento"
    ↓
Resultado: Necesitas 543 piezas (43 adicionales)
    ↓
Actualizar planificación con nueva cantidad
```

---

## 🎨 Esquema de Colores

| Elemento | Color | Uso |
|----------|-------|-----|
| Primary | #0066cc | Botones, links, headers |
| Success | #10b981 | Estados OK, datos buenos |
| Warning | #f59e0b | Alertas, atención requerida |
| Danger | #dc2626 | Errores, crítico |
| Info | #3b82f6 | Información, notas |
| Gray | #6b7280 | Texto secundario |

---

## 📱 Responsive Breakpoints

```
Mobile:  < 640px  (320-640)
Tablet:  640-768px
Desktop: > 768px
```

---

## ✨ Características Destacadas

- ✅ **Responsive:** Funciona en desktop, tablet y mobile
- ✅ **Real-time feedback:** Loading, errors, success messages
- ✅ **Gráficos interactivos:** Recharts con tooltips
- ✅ **Color-coding:** Estados visuales claros
- ✅ **Debugging:** JSON viewer para inspeccionar API responses
- ✅ **Professional UI:** Tailwind CSS clean design
- ✅ **Accessible:** Buttons, labels, forms semánticamente correctos

---

**Frontend Manufacturing AI - Completamente funcional y listo para producción** 🚀
