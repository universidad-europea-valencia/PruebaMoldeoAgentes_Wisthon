# Esquema de Base de Datos (MySQL)

Instrucción: Generar los modelos de SQLAlchemy para estas tablas.

```sql
CREATE TABLE materiales (
    id VARCHAR(50) PRIMARY KEY, -- Ej: 'Ferritico_GJS400'
    descripcion TEXT
);

CREATE TABLE matriz_transicion (
    metal_origen VARCHAR(50),
    metal_destino VARCHAR(50),
    tiempo_minutos INT, -- Tiempo de ajuste
    coste_energetico FLOAT,
    PRIMARY KEY (metal_origen, metal_destino)
);

CREATE TABLE maquinas (
    id VARCHAR(50) PRIMARY KEY, -- 'DISA', 'KW', 'MACH_1', 'CNC_1'
    tipo ENUM('moldeo', 'macheria', 'acabado'),
    estado ENUM('operativo', 'averia', 'mantenimiento') DEFAULT 'operativo'
);

CREATE TABLE ordenes_produccion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    referencia VARCHAR(100),
    cantidad_total INT,
    fecha_entrega DATETIME,
    metal_id VARCHAR(50),
    requiere_macho BOOLEAN,
    ruta_acabado ENUM('robot', 'manual', 'cnc'),
    FOREIGN KEY (metal_id) REFERENCES materiales(id)
);