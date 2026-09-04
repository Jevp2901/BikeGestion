-- Ejecutar una sola vez sobre la base de datos BikeGestion.
-- El costo queda asociado al proveedor y al articulo, no al formulario de compra.
ALTER TABLE proveedor_articulo
    ADD COLUMN precio_compra DECIMAL(12, 2) NOT NULL DEFAULT 0;

-- Para asociaciones existentes, conserva el ultimo costo real registrado.
UPDATE proveedor_articulo pa
LEFT JOIN (
    SELECT c.nit_proveedor, d.id_articulo, d.valor_unitario,
           ROW_NUMBER() OVER (
               PARTITION BY c.nit_proveedor, d.id_articulo
               ORDER BY c.fecha_compra DESC, c.id_compra DESC
           ) AS rn
    FROM compra c
    JOIN detalle_compra d ON d.id_compra = c.id_compra
    WHERE c.estado_compra = 'Realizada'
) ultimo ON ultimo.nit_proveedor = pa.nit_proveedor
         AND ultimo.id_articulo = pa.id_articulo
         AND ultimo.rn = 1
JOIN articulo a ON a.id_articulo = pa.id_articulo
SET pa.precio_compra = COALESCE(
    ultimo.valor_unitario,
    ROUND(a.precio_articulo / (1 + a.porcentaje_ganancia / 100), 2)
);
