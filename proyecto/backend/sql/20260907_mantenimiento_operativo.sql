-- Estructuras operativas para completar la trazabilidad del taller.
-- Ejecutar sobre la base de datos bikegestion antes de usar el flujo ampliado.

CREATE TABLE IF NOT EXISTS mantenimiento_historial (
    id_historial INT AUTO_INCREMENT PRIMARY KEY,
    id_mantenimiento INT NOT NULL,
    id_usuario INT NOT NULL,
    estado_anterior VARCHAR(20) NULL,
    estado_nuevo VARCHAR(20) NOT NULL,
    observacion TEXT NULL,
    fecha_cambio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_mantenimiento_historial_mantenimiento (id_mantenimiento)
);

CREATE TABLE IF NOT EXISTS mantenimiento_checklist (
    id_checklist INT AUTO_INCREMENT PRIMARY KEY,
    id_mantenimiento INT NOT NULL,
    codigo VARCHAR(60) NOT NULL,
    nombre VARCHAR(160) NOT NULL,
    estado ENUM('Pendiente', 'Aprobado', 'Rechazado') NOT NULL DEFAULT 'Pendiente',
    observacion TEXT NULL,
    id_usuario INT NULL,
    fecha_verificacion DATETIME NULL,
    UNIQUE KEY uq_mantenimiento_checklist (id_mantenimiento, codigo),
    INDEX idx_checklist_mantenimiento (id_mantenimiento)
);

CREATE TABLE IF NOT EXISTS mantenimiento_repuesto (
    id_mantenimiento_repuesto INT AUTO_INCREMENT PRIMARY KEY,
    id_mantenimiento INT NOT NULL,
    id_articulo INT NOT NULL,
    cantidad INT NOT NULL,
    observacion VARCHAR(255) NULL,
    id_usuario INT NOT NULL,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_mantenimiento_repuesto_mantenimiento (id_mantenimiento),
    CONSTRAINT chk_mantenimiento_repuesto_cantidad CHECK (cantidad > 0)
);

CREATE TABLE IF NOT EXISTS mantenimiento_entrega (
    id_entrega INT AUTO_INCREMENT PRIMARY KEY,
    id_mantenimiento INT NOT NULL UNIQUE,
    recibido_por VARCHAR(160) NOT NULL,
    observaciones TEXT NULL,
    confirmado TINYINT(1) NOT NULL DEFAULT 1,
    id_usuario INT NOT NULL,
    fecha_entrega DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mantenimiento_ficha (
    id_ficha INT AUTO_INCREMENT PRIMARY KEY,
    id_mantenimiento INT NOT NULL UNIQUE,
    falla_reportada TEXT NULL,
    diagnostico_tecnico TEXT NULL,
    inspeccion_recepcion TEXT NULL,
    recomendaciones TEXT NULL,
    prioridad ENUM('Baja', 'Media', 'Alta', 'Urgente') NOT NULL DEFAULT 'Media',
    id_usuario INT NOT NULL,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Las órdenes existentes también reciben la misma checklist base.
INSERT IGNORE INTO mantenimiento_checklist (id_mantenimiento, codigo, nombre)
SELECT m.id_mantenimiento, c.codigo, c.nombre
FROM mantenimiento m
JOIN (
    SELECT 'frenos' AS codigo, 'Frenos y manetas' AS nombre
    UNION ALL SELECT 'transmision', 'Transmisión y cambios'
    UNION ALL SELECT 'ruedas', 'Ruedas y presión'
    UNION ALL SELECT 'direccion', 'Dirección y ajuste'
    UNION ALL SELECT 'prueba', 'Prueba final de funcionamiento'
) c;
