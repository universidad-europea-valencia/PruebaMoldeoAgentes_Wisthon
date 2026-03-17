# Arquitectura del Sistema Multi-Agente

## 1. Definición de Agentes y Skills

### Agente de Fusión (Lead Metallurgist)
- **Skill:** `transition_optimizer`. Calcula el camino más corto entre aleaciones.
- **Lógica:** Si el Metal A es Ferrítico y el B es Perlítico, el coste es bajo. Si es a la inversa, requiere vaciado/dilución (coste alto).

### Agente de Machería (Core Sync)
- **Skill:** `lead_time_buffer`. Gestiona las 6 máquinas.
- **Lógica:** Como fabrica más lento que el moldeo, debe generar un stock de seguridad (WIP). Si el stock cae, ordena a Moldeo fabricar piezas "sin macho".

### Agente de Línea (KW & Disa)
- **Skill:** `molding_execution`. Gestiona los tiempos de ciclo de placas y cambios de modelo.

### Agente de Calidad (Scrap Manager)
- **Skill:** `dynamic_replenishment`. 
- **Fórmula:** Incrementa el lote $N$ según: $N_{new} = \frac{N_{target}}{1 - R_{scrap}}$.

### Agente de Mantenimiento (Incident Handler)
- **Skill:** `rerouting`. Ante un `status == 'DOWN'`, busca rutas alternativas (CNC -> Manual).

## 2. Flujo de Trabajo (Workflows)
1. **Planning:** Orquestador -> Fusión (Secuencia Metales) -> Machería (Disponibilidad) -> Solver (Gantt Final).
2. **Reactive:** Sensor/User -> Mantenimiento (Avería) -> Orquestador (Re-planificación inmediata).