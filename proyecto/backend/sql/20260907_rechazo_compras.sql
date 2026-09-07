-- Rechazo manual y trazabilidad de compras.
ALTER TABLE compra
    ADD COLUMN motivo_rechazo VARCHAR(500) NULL AFTER estado_compra;

CREATE TABLE IF NOT EXISTS bitacora_compra (
    id_bitacora INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_compra INT UNSIGNED NOT NULL,
    id_usuario INT UNSIGNED NOT NULL,
    accion VARCHAR(80) NOT NULL,
    motivo VARCHAR(500) NOT NULL,
    fecha_evento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_bitacora_compra_compra (id_compra),
    INDEX idx_bitacora_compra_usuario (id_usuario)
);
