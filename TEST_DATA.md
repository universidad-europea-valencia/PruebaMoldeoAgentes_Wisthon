# Datos de Prueba para Validación del Sistema

Utilizar estos datos para poblar la base de datos y estresar el algoritmo de los agentes.

## Caso 1: Sincronización de Metales
- **Orden A:** 500 piezas Ferríticas.
- **Orden B:** 200 piezas Perlíticas.
- **Orden C:** 500 piezas Ferríticas.
*Resultado esperado:* El Agente de Fusión debe agrupar A y C, dejando B para el final para evitar dos cambios químicos innecesarios.

## Caso 2: Cuello de Botella en Machería
- **Línea Disa:** Velocidad 300 moldes/hora.
- **Máquina Machos:** Velocidad 50 machos/hora.
*Resultado esperado:* El Agente de Machería debe activar una alerta de "Falta de stock" 4 horas antes de que la Disa agote los machos, obligando al Orquestador a cambiar la secuencia a piezas sin macho.

## Caso 3: Avería Reactiva
- Durante la ejecución de la **Orden A**, marcar `maquina_id = 'CNC_1'` como `averia`.
*Resultado esperado:* El Agente de Mantenimiento debe disparar una re-ruta a `acabado_manual` y actualizar la fecha de expedición en el Dashboard.