-- Integridad de stock para compras y ventas. Ejecutar en la base bikegestion.
DROP TRIGGER IF EXISTS trg_compra_actualiza_stock;
DROP TRIGGER IF EXISTS trg_venta_stock_suficiente;
DROP TRIGGER IF EXISTS trg_venta_descuenta_stock;
DROP TRIGGER IF EXISTS trg_venta_devuelta_reingresa_stock;

DELIMITER //

CREATE TRIGGER trg_compra_actualiza_stock
AFTER INSERT ON detalle_compra
FOR EACH ROW
BEGIN
    DECLARE v_estado VARCHAR(20);
    SELECT estado_compra INTO v_estado
      FROM compra
     WHERE id_compra = NEW.id_compra;

    IF v_estado = 'Realizada' THEN
        INSERT INTO inventario_articulo
            (id_inventario, id_articulo, cantidad_actual, stock_minimo,
             stock_maximo, entrada, salida, fecha_actualizacion)
        VALUES (1, NEW.id_articulo, NEW.cantidad_articulo, 5,
                5, NEW.cantidad_articulo, 0, CURRENT_DATE)
        ON DUPLICATE KEY UPDATE
            entrada = entrada + NEW.cantidad_articulo,
            cantidad_actual = cantidad_actual + NEW.cantidad_articulo,
            fecha_actualizacion = CURRENT_DATE;
    END IF;
END//

CREATE TRIGGER trg_venta_stock_suficiente
BEFORE INSERT ON detalle_venta
FOR EACH ROW
BEGIN
    DECLARE v_stock INT;
    SELECT cantidad_actual INTO v_stock
      FROM inventario_articulo
     WHERE id_articulo = NEW.id_articulo
     LIMIT 1;

    IF v_stock IS NULL OR v_stock < NEW.cantidad_articulo THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Stock insuficiente para completar la venta';
    END IF;
END//

CREATE TRIGGER trg_venta_descuenta_stock
AFTER INSERT ON detalle_venta
FOR EACH ROW
BEGIN
    UPDATE inventario_articulo
       SET salida = salida + NEW.cantidad_articulo,
           cantidad_actual = cantidad_actual - NEW.cantidad_articulo,
           fecha_actualizacion = CURRENT_DATE
     WHERE id_articulo = NEW.id_articulo;
END//

CREATE TRIGGER trg_venta_devuelta_reingresa_stock
AFTER UPDATE ON venta
FOR EACH ROW
BEGIN
    IF OLD.estado_venta = 'Realizada' AND NEW.estado_venta = 'Devuelta' THEN
        UPDATE inventario_articulo ia
        JOIN detalle_venta dv ON dv.id_articulo = ia.id_articulo
           SET ia.cantidad_actual = ia.cantidad_actual + dv.cantidad_articulo,
               ia.salida = GREATEST(ia.salida - dv.cantidad_articulo, 0),
               ia.fecha_actualizacion = CURRENT_DATE
         WHERE dv.id_venta = NEW.id_venta;
    END IF;
END//

DELIMITER ;
