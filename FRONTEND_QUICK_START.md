# 🚀 GUÍA RÁPIDA - Frontend Manufacturing AI

## ✅ Estado Actual

**Frontend:** ✓ Corriendo en http://localhost:3000/  
**Backend:** ✓ Corriendo en http://localhost:8001/  
**Conexión:** ✓ Automática y lista

---

## 🎯 Acceso Rápido a Módulos

### 1. **Dashboard Principal** 📊
- **URL:** http://localhost:3000/
- **Para:** Vista general de KPIs, producción y alertas
- **Acción:** Abre automáticamente en la primera carga

### 2. **Orquestador** ⚡
- **Para:** Ejecutar workflows completos
- **Opciones:**
  - **Planning:** Fusion → Macheria → Linea
  - **Reactive:** Maintenance → Replanning
- **Recomendación:** Empezar aquí para workflows automáticos

### 3. **Agente de Fusión** 🔨
- **Para:** Optimización de secuencia de metales
- **Entrada:** Órdenes de producción con materiales
- **Salida:** Secuencia optimizada + costos de transición

### 4. **Agente de Machería** ⚙️
- **Para:** Análisis de cuello de botella en producción de machos
- **Parámetros clave:**
  - Tasa de moldeo (piezas/hora)
  - Stock de núcleos actual
  - Horas de seguridad
- **Alerta:** Si < 4 horas = CRÍTICO

### 5. **Agente de Línea** 📈
- **Para:** Planificación de tiempos y modelos
- **Destaca:** Cambios costosos entre modelos
- **Beneficio:** Agrupación inteligente de lotes

### 6. **Agente de Calidad** ✓
- **Para:** Cálculo de reabastecimiento por scrap
- **Fórmula:** N_new = N_target / (1 - R_scrap)
- **Impacto:** Piezas adicionales necesarias

### 7. **Agente de Mantenimiento** 🔧
- **Para:** Gestión de incidentes de máquinas
- **Máquinas:** CNC_1, CNC_2, Robot_1, Manual_1
- **Estados:** Avería, Operativo, Mantenimiento
- **Beneficio:** Rerouting automático de órdenes

---

## 📝 Flujo de Trabajo Típico

### Escenario 1: Planificación Diaria
1. Abrir **Dashboard** → revisar estado general
2. Ejecutar **Planning** en Orquestador
3. Revisar resultados de cada agente:
   - Fusión: secuencia y transiciones
   - Machería: bottleneck y horas críticas
   - Línea: carga y cambios costosos
   - Calidad: piezas adicionales
4. Actuar según recomendaciones con IA

### Escenario 2: Incidente de Máquina
1. Abrir **Mantenimiento**
2. Seleccionar máquina afectada
3. Cambiar estado a "Avería"
4. Sistema automáticamente:
   - Detecta rutas impactadas
   - Reroutea órdenes
   - Genera recomendaciones

### Escenario 3: Control de Calidad
1. Abrir **Calidad**
2. Ingresar tasa de scrap actual
3. Sistema calcula piezas adicionales necesarias
4. Obtener recomendaciones de acción

---

## 💡 Tips y Trucos

### Habilitar IA en Recomendaciones
- ✓ Si tienes credenciales LLM configuradas en el backend
- ✓ Marca checkbox "Usar LLM para explicación"
- ✓ Obtendrás análisis más profundos y narrativas

### Interpretar Colores en Métricas
- 🟢 **Verde (success):** Condición normal o buena
- 🟡 **Amarillo (warning):** Atención requerida
- 🔴 **Rojo (danger):** Acción inmediata necesaria

### Monitoreo en Tiempo Real
- Cada formulario en cada módulo es independiente
- Puedes ajustar parámetros y re-ejecutar
- Los resultados se actualizan al instante

### Visualización de Datos JSON
- Al final de cada resultado hay sección "Datos en JSON"
- Útil para:
  - Debugging
  - Integración con otros sistemas
  - Auditoría de decisiones

---

## 🔗 URLs Importantes

| Componente | URL | Estado |
|-----------|-----|--------|
| Frontend | http://localhost:3000/ | ✓ Corriendo |
| Backend API | http://localhost:8001/ | ✓ Corriendo |
| Fusion | POST /fusion/plan | ✓ Disponible |
| Macheria | POST /macheria/analyze | ✓ Disponible |
| Linea | POST /linea/plan | ✓ Disponible |
| Calidad | POST /calidad/replenish | ✓ Disponible |
| Mantenimiento | POST /mantenimiento/incident | ✓ Disponible |
| Orchestrator | POST /orchestrator/planning | ✓ Disponible |
| Orchestrator | POST /orchestrator/reactive | ✓ Disponible |

---

## 📱 Sidebar Navigation

Botón **☰** (hamburguesa) en esquina superior izquierda para:
- Abrir/cerrar sidebar
- Vista más limpia en pantallas pequeñas
- Acceso a todos los módulos

---

## 🆘 Solución de Problemas

### "Error de conexión con API"
- ✓ Verificar que backend está corriendo: `docker ps`
- ✓ Verificar puerto 8001 esté escuchando
- ✓ Revisar consola del navegador (F12)

### "LLM no disponible"
- ✓ Esto es NORMAL si no hay credenciales configuradas
- ✓ Sistema funciona perfectamente en modo "rules-only"
- ✓ El LLM es OPCIONAL para explicaciones

### "Datos vacíos en resultados"
- ✓ Verificar parámetros de entrada
- ✓ Revisar formato de datos
- ✓ Consultar "Datos en JSON" para detalles técnicos

---

## 📊 Ejemplo de Datos de Entrada

### Machería
```json
{
  "molding_rate_per_hour": 300,
  "core_rate_per_hour_per_machine": 50,
  "current_core_stock": 200,
  "safety_buffer_hours": 4,
  "horizon_hours": 8,
  "include_llm": false
}
```

### Calidad
```json
{
  "target_quantity": 500,
  "scrap_rate": 0.08,  // 8%
  "include_llm": false
}
```

### Mantenimiento
```json
{
  "machine_id": "CNC_1",
  "new_status": "averia",  // "averia" | "operativo" | "mantenimiento"
  "include_llm": false
}
```

---

## 🎓 Conceptos Clave

### Hybrid Architecture
- **Reglas (Determinísticas):** Decisiones duras de fabricación
- **LLM (Explicativo):** Narrativas, riesgos, recomendaciones
- **Nunca delegada al LLM:** Credenciales, estado de BD, cambios

### Bottleneck Analysis
`horas_hasta_rotura = stock_actual / (demanda_por_hora - produccion_por_hora)`

Si `horas_hasta_rotura < safety_buffer` → CRÍTICO

### Quality Formula
`N_new = N_target / (1 - R_scrap)`

Ejemplo: 500 piezas, 8% scrap
→ Necesitas 543 piezas para garantizar 500 buenas

### Rerouting
Si máquina falla:
- CNC → Manual ✓
- Robot → CNC ✓
- Automático y optimizado

---

## 🚀 Siguientes Pasos

1. ✅ Frontend corriendo
2. ✅ Conectado a Backend
3. 📌 **Próximo:** Ingresar datos reales de tu fabrica
4. 📌 **Probar:** Habilitar LLM si tienes credenciales
5. 📌 **Optimizar:** Ajustar parámetros según operación

---

## 📞 Soporte en Desarrollo

```bash
# Ver logs del frontend
npm run dev  # Ya está corriendo en terminal

# Ver logs del backend
docker-compose logs api

# Ambos en paralelo
docker-compose up  # Terminal 1
npm run dev        # Terminal 2
```

---

**¡Sistema 100% funcional y listo para usar! 🎯**

*Para más info: leer README.md en carpeta frontend/*
