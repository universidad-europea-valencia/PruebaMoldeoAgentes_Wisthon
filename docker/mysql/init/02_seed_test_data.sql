INSERT INTO materiales (id, descripcion)
VALUES
    ('Ferritico_GJS400', 'Aleacion ferritica para automocion'),
    ('Perlitico_GJS700', 'Aleacion perlitica para alta resistencia')
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);

INSERT INTO matriz_transicion (metal_origen, metal_destino, tiempo_minutos, coste_energetico)
VALUES
    ('Ferritico_GJS400', 'Ferritico_GJS400', 0, 0.0),
    ('Perlitico_GJS700', 'Perlitico_GJS700', 0, 0.0),
    ('Ferritico_GJS400', 'Perlitico_GJS700', 15, 1.2),
    ('Perlitico_GJS700', 'Ferritico_GJS400', 90, 4.0)
ON DUPLICATE KEY UPDATE
    tiempo_minutos = VALUES(tiempo_minutos),
    coste_energetico = VALUES(coste_energetico);

INSERT INTO maquinas (id, tipo, estado)
VALUES
    ('DISA', 'moldeo', 'operativo'),
    ('KW', 'moldeo', 'operativo'),
    ('MACH_1', 'macheria', 'operativo'),
    ('MACH_2', 'macheria', 'operativo'),
    ('MACH_3', 'macheria', 'operativo'),
    ('MACH_4', 'macheria', 'operativo'),
    ('MACH_5', 'macheria', 'operativo'),
    ('MACH_6', 'macheria', 'operativo'),
    ('CNC_1', 'acabado', 'operativo'),
    ('CNC_2', 'acabado', 'operativo'),
    ('ROBOT_1', 'acabado', 'operativo'),
    ('MANUAL_1', 'acabado', 'operativo')
ON DUPLICATE KEY UPDATE
    tipo = VALUES(tipo),
    estado = VALUES(estado);

INSERT INTO ordenes_produccion (referencia, cantidad_total, fecha_entrega, metal_id, requiere_macho, ruta_acabado)
VALUES
    ('ORDEN_A', 500, DATE_ADD(NOW(), INTERVAL 1 DAY), 'Ferritico_GJS400', TRUE, 'cnc'),
    ('ORDEN_B', 200, DATE_ADD(NOW(), INTERVAL 2 DAY), 'Perlitico_GJS700', TRUE, 'robot'),
    ('ORDEN_C', 500, DATE_ADD(NOW(), INTERVAL 3 DAY), 'Ferritico_GJS400', FALSE, 'manual');
