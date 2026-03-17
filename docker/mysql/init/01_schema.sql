CREATE TABLE IF NOT EXISTS materiales (
    id VARCHAR(50) PRIMARY KEY,
    descripcion TEXT
);

CREATE TABLE IF NOT EXISTS matriz_transicion (
    metal_origen VARCHAR(50),
    metal_destino VARCHAR(50),
    tiempo_minutos INT,
    coste_energetico FLOAT,
    PRIMARY KEY (metal_origen, metal_destino)
);

CREATE TABLE IF NOT EXISTS maquinas (
    id VARCHAR(50) PRIMARY KEY,
    tipo ENUM('moldeo', 'macheria', 'acabado'),
    estado ENUM('operativo', 'averia', 'mantenimiento') DEFAULT 'operativo'
);

CREATE TABLE IF NOT EXISTS ordenes_produccion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    referencia VARCHAR(100),
    cantidad_total INT,
    fecha_entrega DATETIME,
    metal_id VARCHAR(50),
    requiere_macho BOOLEAN,
    ruta_acabado ENUM('robot', 'manual', 'cnc'),
    FOREIGN KEY (metal_id) REFERENCES materiales(id)
);
