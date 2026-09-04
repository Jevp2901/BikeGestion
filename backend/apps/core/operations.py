from datetime import date

from django.db import connection, transaction
from rest_framework.response import Response
from rest_framework.views import APIView


def _rows(cursor):
    columns = [item[0] for item in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]


def _json_rows(sql, params=()):
    with connection.cursor() as cursor:
        cursor.execute(sql, params)
        return _rows(cursor)


def _one(sql, params=()):
    rows = _json_rows(sql, params)
    return rows[0] if rows else None


def _required(data, names):
    missing = [name for name in names if data.get(name) in (None, "")]
    return {name: "Este campo es obligatorio." for name in missing}


class ClienteListView(APIView):
    def get(self, request):
        return Response(_json_rows("""SELECT id_cliente, nombre_cliente, num_documento, telefono_cliente
            FROM cliente ORDER BY nombre_cliente"""))

    def post(self, request):
        data = request.data
        errors = _required(data, ["nombre_cliente", "num_documento"])
        if errors:
            return Response(errors, status=400)
        try:
            with transaction.atomic(), connection.cursor() as cursor:
                cursor.execute("""INSERT INTO cliente
                    (nombre_cliente, num_documento, telefono_cliente)
                    VALUES (%s, %s, %s)""", [
                        data["nombre_cliente"].strip(),
                        data["num_documento"].strip(),
                        data.get("telefono_cliente") or None,
                    ])
                cliente_id = cursor.lastrowid
            return Response(_one("""SELECT id_cliente, nombre_cliente, num_documento, telefono_cliente
                FROM cliente WHERE id_cliente = %s""", [cliente_id]), status=201)
        except Exception as exc:
            return Response({"error": str(exc)}, status=400)


class ProveedorListView(APIView):
    def get(self, request):
        sql = """
            SELECT p.nit_proveedor, p.nombre_proveedor, p.direccion,
                   p.telefono, p.correo, p.estado,
                   COUNT(DISTINCT pa.id_articulo) AS articulos_asociados,
                   GROUP_CONCAT(DISTINCT a.tipo_articulo ORDER BY a.tipo_articulo SEPARATOR ', ') AS tipos_articulo
            FROM proveedor p
            LEFT JOIN proveedor_articulo pa ON pa.nit_proveedor = p.nit_proveedor
            LEFT JOIN articulo a ON a.id_articulo = pa.id_articulo
        """
        sql += " GROUP BY p.nit_proveedor ORDER BY p.estado, p.nombre_proveedor"
        return Response(_json_rows(sql))

    def post(self, request):
        errors = _required(request.data, ["nombre_proveedor"])
        if errors:
            return Response(errors, status=400)
        data = request.data
        try:
            with transaction.atomic(), connection.cursor() as cursor:
                cursor.execute(
                    "SELECT COALESCE(MAX(nit_proveedor), 900100000) + 1 FROM proveedor"
                )
                nit_proveedor = cursor.fetchone()[0]
                cursor.execute(
                    """INSERT INTO proveedor
                    (nit_proveedor, nombre_proveedor, direccion, telefono, correo, estado)
                    VALUES (%s, %s, %s, %s, %s, 'Activo')""",
                    [nit_proveedor, data["nombre_proveedor"].strip(), data.get("direccion"),
                     data.get("telefono") or None, data.get("correo") or None],
                )
                proveedor = _one("SELECT * FROM proveedor WHERE nit_proveedor = %s", [nit_proveedor])
            return Response(proveedor, status=201)
        except Exception as exc:
            return Response({"error": str(exc)}, status=400)


class ProveedorDetailView(APIView):
    def get(self, request, nit_proveedor):
        proveedor = _one("SELECT * FROM proveedor WHERE nit_proveedor = %s", [nit_proveedor])
        if not proveedor:
            return Response({"error": "Proveedor no encontrado."}, status=404)
        proveedor["articulos"] = _json_rows(
            """SELECT a.id_articulo, a.nombre_articulo, a.tipo_articulo,
                      a.precio_articulo,
                      pa.precio_compra,
                      COALESCE((SELECT SUM(ia.cantidad_actual)
                                FROM inventario_articulo ia
                                WHERE ia.id_articulo = a.id_articulo), 0) AS stock_actual
               FROM proveedor_articulo pa JOIN articulo a ON a.id_articulo = pa.id_articulo
               WHERE pa.nit_proveedor = %s ORDER BY a.nombre_articulo""",
            [nit_proveedor],
        )
        return Response(proveedor)

    def patch(self, request, nit_proveedor):
        allowed = {"nombre_proveedor", "direccion", "telefono", "correo", "estado"}
        if "estado" in request.data and request.data["estado"] not in {"Activo", "Inactivo"}:
            return Response({"estado": "El estado debe ser Activo o Inactivo."}, status=400)
        fields = [(key, request.data[key]) for key in allowed if key in request.data]
        if not fields:
            return Response({"error": "No hay campos para actualizar."}, status=400)
        assignments = ", ".join(f"{key} = %s" for key, _ in fields)
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    f"UPDATE proveedor SET {assignments} WHERE nit_proveedor = %s",
                    [value for _, value in fields] + [nit_proveedor],
                )
            return self.get(request, nit_proveedor)
        except Exception as exc:
            return Response({"error": str(exc)}, status=400)


class ProveedorArticuloView(APIView):
    def post(self, request, nit_proveedor):
        articulo = request.data.get("id_articulo")
        precio = request.data.get("precio_compra")
        if not articulo or precio in (None, ""):
            return Response({"error": "Artículo y precio de compra son obligatorios."}, status=400)
        try:
            if float(precio) <= 0:
                raise ValueError("El precio de compra debe ser mayor que cero.")
            with connection.cursor() as cursor:
                cursor.execute(
                    "INSERT INTO proveedor_articulo (nit_proveedor, id_articulo, precio_compra) VALUES (%s, %s, %s)",
                    [nit_proveedor, articulo, precio],
                )
            return ProveedorDetailView().get(request, nit_proveedor)
        except Exception as exc:
            return Response({"error": str(exc)}, status=400)

    def patch(self, request, nit_proveedor, id_articulo):
        precio = request.data.get("precio_compra")
        try:
            if precio in (None, "") or float(precio) <= 0:
                return Response({"error": "El precio de compra debe ser mayor que cero."}, status=400)
            with connection.cursor() as cursor:
                cursor.execute(
                    "UPDATE proveedor_articulo SET precio_compra = %s WHERE nit_proveedor = %s AND id_articulo = %s",
                    [precio, nit_proveedor, id_articulo],
                )
            return ProveedorDetailView().get(request, nit_proveedor)
        except Exception as exc:
            return Response({"error": str(exc)}, status=400)

    def delete(self, request, nit_proveedor):
        try:
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM proveedor WHERE nit_proveedor = %s", [nit_proveedor])
            return Response(status=204)
        except Exception as exc:
            return Response({"error": str(exc)}, status=400)


class CotizacionListView(APIView):
    def get(self, request):
        return Response(_json_rows("""SELECT c.*, cl.nombre_cliente
            FROM cotizacion c LEFT JOIN cliente cl ON cl.id_cliente = c.id_cliente
            ORDER BY c.id_cotizacion DESC"""))

    def post(self, request):
        data = request.data
        errors = _required(data, ["id_usuario", "fecha_cotizacion", "detalles"])
        if errors:
            return Response(errors, status=400)
        detalles = data.get("detalles") or []
        if not detalles:
            return Response({"detalles": "Debe incluir al menos un artículo."}, status=400)
        try:
            with transaction.atomic(), connection.cursor() as cursor:
                cursor.execute("""INSERT INTO cotizacion
                    (id_cliente, id_usuario, fecha_cotizacion, estado_cotizacion)
                    VALUES (%s, %s, %s, 'Borrador')""",
                    [data.get("id_cliente"), data["id_usuario"], data["fecha_cotizacion"]])
                cotizacion_id = cursor.lastrowid
                for detail in detalles:
                    cursor.execute("""INSERT INTO detalle_cotizacion
                        (id_cotizacion, id_articulo, valor_unitario, cantidad_articulo, descuento_cotizacion)
                        SELECT %s, id_articulo, %s, %s, %s FROM articulo
                        WHERE id_articulo = %s AND activo = 1""",
                        [cotizacion_id, detail.get("valor_unitario"), detail.get("cantidad_articulo"),
                         detail.get("descuento_cotizacion", 0), detail.get("id_articulo")])
                    if cursor.rowcount != 1:
                        raise ValueError("El artículo cotizado no existe o está inactivo.")
            return Response(_one("SELECT * FROM cotizacion WHERE id_cotizacion = %s", [cotizacion_id]), status=201)
        except Exception as exc:
            return Response({"error": str(exc)}, status=400)


class CotizacionDetailView(APIView):
    def get(self, request, id_cotizacion):
        item = _one("SELECT * FROM cotizacion WHERE id_cotizacion = %s", [id_cotizacion])
        if not item:
            return Response({"error": "Cotización no encontrada."}, status=404)
        item["detalles"] = _json_rows("""SELECT d.*, a.nombre_articulo
            FROM detalle_cotizacion d JOIN articulo a ON a.id_articulo = d.id_articulo
            WHERE d.id_cotizacion = %s""", [id_cotizacion])
        return Response(item)

    def patch(self, request, id_cotizacion):
        estado = request.data.get("estado_cotizacion")
        if estado not in {"Borrador", "Aceptada", "Rechazada"}:
            return Response({"estado_cotizacion": "Estado inválido."}, status=400)
        with connection.cursor() as cursor:
            cursor.execute("UPDATE cotizacion SET estado_cotizacion = %s WHERE id_cotizacion = %s", [estado, id_cotizacion])
        return self.get(request, id_cotizacion)


class CompraListView(APIView):
    def get(self, request):
        compras = _json_rows("""SELECT c.*, p.nombre_proveedor
            FROM compra c JOIN proveedor p ON p.nit_proveedor = c.nit_proveedor
            ORDER BY c.id_compra DESC""")
        for compra in compras:
            compra["detalles"] = _json_rows("""SELECT d.id_articulo,
                    d.cantidad_articulo, d.valor_unitario, d.total_compra,
                    a.nombre_articulo
                FROM detalle_compra d
                JOIN articulo a ON a.id_articulo = d.id_articulo
                WHERE d.id_compra = %s""", [compra["id_compra"]])
            compra["recibo"] = _one("""SELECT id_recibo, fecha_emision, total
                FROM recibo WHERE id_compra = %s""", [compra["id_compra"]])
        return Response(compras)

    def post(self, request):
        data = request.data
        errors = _required(data, ["id_usuario", "nit_proveedor", "fecha_compra", "metodo_pago", "detalles"])
        if errors:
            return Response(errors, status=400)
        if data.get("metodo_pago") not in {"Tarjeta credito", "Debito", "Efectivo"}:
            return Response({"metodo_pago": "Medio de pago inválido."}, status=400)
        detalles = data.get("detalles") or []
        try:
            proveedor = _one(
                "SELECT nit_proveedor FROM proveedor WHERE nit_proveedor = %s AND estado = 'Activo'",
                [data["nit_proveedor"]],
            )
            if not proveedor:
                raise ValueError("Solo se puede comprar a un proveedor activo.")

            if not _one("SELECT id_usuario FROM usuario WHERE id_usuario = %s", [data["id_usuario"]]):
                raise ValueError("El usuario que registra la compra no existe.")

            try:
                date.fromisoformat(str(data["fecha_compra"]))
            except (TypeError, ValueError):
                raise ValueError("La fecha de compra no es válida.")

            def register_rejected(reason):
                with transaction.atomic(), connection.cursor() as cursor:
                    cursor.execute("""INSERT INTO compra
                        (id_usuario, nit_proveedor, fecha_compra, estado_compra, metodo_pago)
                        VALUES (%s, %s, %s, 'Rechazada', %s)""",
                        [data["id_usuario"], data["nit_proveedor"], data["fecha_compra"], data["metodo_pago"]])
                    rejected_id = cursor.lastrowid
                return Response({
                    "error": reason,
                    "id_compra": rejected_id,
                    "estado_compra": "Rechazada",
                }, status=400)

            if not detalles:
                return register_rejected("Debe incluir al menos un artículo.")

            validated_details = []
            for detail in detalles:
                article_id = detail.get("id_articulo")
                quantity = detail.get("cantidad_articulo")
                association = _one(
                    "SELECT precio_compra FROM proveedor_articulo WHERE nit_proveedor = %s AND id_articulo = %s",
                    [data["nit_proveedor"], article_id],
                )
                if not association:
                    return register_rejected("Uno de los artículos no está asociado al proveedor seleccionado.")
                fixed_price = association["precio_compra"]
                try:
                    quantity = int(quantity)
                except (TypeError, ValueError):
                    return register_rejected("La cantidad de cada artículo debe ser un número entero mayor que cero.")
                if quantity <= 0:
                    return register_rejected("La cantidad de cada artículo debe ser mayor que cero.")
                if fixed_price is None or float(fixed_price) <= 0:
                    return register_rejected("El artículo no tiene un precio de compra fijo válido.")
                validated_details.append({**detail, "cantidad_articulo": quantity, "valor_unitario": fixed_price})
            with transaction.atomic(), connection.cursor() as cursor:
                cursor.execute("""INSERT INTO compra
                    (id_usuario, nit_proveedor, fecha_compra, estado_compra, metodo_pago)
                    VALUES (%s, %s, %s, 'Realizada', %s)""",
                    [data["id_usuario"], data["nit_proveedor"], data["fecha_compra"], data["metodo_pago"]])
                compra_id = cursor.lastrowid
                for detail in validated_details:
                    cursor.execute("""INSERT INTO detalle_compra
                        (id_compra, id_articulo, valor_unitario, cantidad_articulo, descuento_compra)
                        VALUES (%s, %s, %s, %s, %s)""",
                        [compra_id, detail.get("id_articulo"), detail.get("valor_unitario"),
                         detail.get("cantidad_articulo"), detail.get("descuento_compra", 0)])
                cursor.execute("INSERT INTO recibo (id_compra, total) SELECT %s, COALESCE(SUM(total_compra), 0) FROM detalle_compra WHERE id_compra = %s", [compra_id, compra_id])
            return Response(_one("SELECT * FROM compra WHERE id_compra = %s", [compra_id]), status=201)
        except Exception as exc:
            return Response({"error": str(exc)}, status=400)


class VentaListView(APIView):
    def get(self, request):
        ventas = _json_rows("""SELECT v.*, cl.nombre_cliente
            FROM venta v LEFT JOIN cliente cl ON cl.id_cliente = v.id_cliente
            ORDER BY v.id_venta DESC""")
        for venta in ventas:
            venta["detalles"] = _json_rows("""SELECT d.id_articulo,
                    d.cantidad_articulo, d.valor_unitario, d.total_venta,
                    a.nombre_articulo
                FROM detalle_venta d
                JOIN articulo a ON a.id_articulo = d.id_articulo
                WHERE d.id_venta = %s""", [venta["id_venta"]])
        return Response(ventas)

    def post(self, request):
        data = request.data
        errors = _required(data, ["id_usuario", "id_cotizacion", "fecha_venta", "metodo_pago"])
        if errors:
            return Response(errors, status=400)
        try:
            with transaction.atomic(), connection.cursor() as cursor:
                cursor.execute("""INSERT INTO venta
                    (id_usuario, id_cliente, id_cotizacion, fecha_venta, estado_venta, metodo_pago)
                    SELECT %s, id_cliente, id_cotizacion, %s, 'Realizada', %s
                    FROM cotizacion WHERE id_cotizacion = %s AND estado_cotizacion = 'Aceptada'""",
                    [data["id_usuario"], data["fecha_venta"], data["metodo_pago"], data["id_cotizacion"]])
                if cursor.rowcount != 1:
                    raise ValueError("Solo una cotización aceptada puede convertirse en venta.")
                venta_id = cursor.lastrowid
                cursor.execute("""INSERT INTO detalle_venta
                    (id_venta, id_articulo, valor_unitario, cantidad_articulo, descuento_venta)
                    SELECT %s, id_articulo, valor_unitario, cantidad_articulo, descuento_cotizacion
                    FROM detalle_cotizacion WHERE id_cotizacion = %s""", [venta_id, data["id_cotizacion"]])
                cursor.execute("INSERT INTO pago_venta (id_venta, metodo_pago, valor_pagado) SELECT %s, %s, COALESCE(SUM(total_venta), 0) FROM detalle_venta WHERE id_venta = %s", [venta_id, data["metodo_pago"], venta_id])
                cursor.execute("INSERT INTO recibo (id_venta, total) SELECT %s, COALESCE(SUM(total_venta), 0) FROM detalle_venta WHERE id_venta = %s", [venta_id, venta_id])
            return Response(_one("SELECT * FROM venta WHERE id_venta = %s", [venta_id]), status=201)
        except Exception as exc:
            return Response({"error": str(exc)}, status=400)


class VentaDetailView(APIView):
    def get(self, request, id_venta):
        venta = _one("""SELECT v.*, cl.nombre_cliente, cl.num_documento,
                cl.telefono_cliente, u.nombre_usuario
            FROM venta v
            LEFT JOIN cliente cl ON cl.id_cliente = v.id_cliente
            LEFT JOIN usuario u ON u.id_usuario = v.id_usuario
            WHERE v.id_venta = %s""", [id_venta])
        if not venta:
            return Response({"error": "Venta no encontrada."}, status=404)
        venta["detalles"] = _json_rows("""SELECT d.id_detalle_venta, d.id_articulo,
                d.valor_unitario, d.cantidad_articulo, d.descuento_venta,
                d.subtotal, d.total_venta, a.nombre_articulo, a.tipo_articulo,
                a.material, a.color, a.tamano
            FROM detalle_venta d
            JOIN articulo a ON a.id_articulo = d.id_articulo
            WHERE d.id_venta = %s ORDER BY d.id_detalle_venta""", [id_venta])
        venta["pago"] = _one("""SELECT id_pago_venta, fecha_pago, metodo_pago,
                valor_pagado, estado_pago
            FROM pago_venta WHERE id_venta = %s""", [id_venta])
        venta["recibo"] = _one("""SELECT id_recibo, fecha_emision, total
            FROM recibo WHERE id_venta = %s""", [id_venta])
        venta["total"] = sum((item.get("total_venta") or 0) for item in venta["detalles"])
        return Response(venta)

    def patch(self, request, id_venta):
        if request.data.get("estado_venta") != "Devuelta":
            return Response({"estado_venta": "Solo se permite registrar una devolución."}, status=400)
        with connection.cursor() as cursor:
            cursor.execute("UPDATE venta SET estado_venta = 'Devuelta' WHERE id_venta = %s AND estado_venta = 'Realizada'", [id_venta])
            cursor.execute("UPDATE pago_venta SET estado_pago = 'Revertido' WHERE id_venta = %s", [id_venta])
        return Response(_one("SELECT * FROM venta WHERE id_venta = %s", [id_venta]))


class ReporteView(APIView):
    VIEWS = {
        "inventario": "vw_stock_bajo",
        "ventas": "vw_ventas_articulos",
        "compras": "vw_historial_compras_proveedor",
        "mantenimiento": "mantenimiento",
        "empleados": "empleado",
    }

    def get(self, request):
        tipo = request.query_params.get("tipo", "inventario").lower()
        view = self.VIEWS.get(tipo)
        if not view:
            return Response({"error": "Tipo de reporte inválido."}, status=400)
        return Response({"tipo": tipo, "generado_en": date.today(), "datos": _json_rows(f"SELECT * FROM {view}")})


class EmpleadoListView(APIView):
    def get(self, request):
        return Response(_json_rows("""SELECT e.*, u.nombre_usuario
            FROM empleado e JOIN usuario u ON u.id_usuario = e.usuario_id
            ORDER BY e.estado_activo DESC, e.numero_documento"""))

    def post(self, request):
        data = request.data
        required = ["usuario_id", "numero_documento", "fecha_nacimiento", "genero",
                    "cargo", "tipo_contrato", "fecha_ingreso", "salario_base"]
        errors = _required(data, required)
        if errors:
            return Response(errors, status=400)
        if data.get("cargo") not in {"Vendedor", "Mecanico"}:
            return Response({"cargo": "El cargo debe ser Vendedor o Mecanico."}, status=400)
        try:
            with connection.cursor() as cursor:
                cursor.execute("""INSERT INTO empleado
                    (usuario_id, tipo_documento, numero_documento, fecha_nacimiento,
                     estado_civil, genero, cargo, departamento, jefe_inmediato_id,
                     tipo_contrato, fecha_ingreso, salario_base, auxilio_transporte,
                     bonificacion_fija, porcentaje_salud, porcentaje_pension,
                     tiene_embargo, valor_embargo)
                    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
                    [data["usuario_id"], data.get("tipo_documento", "CC"), data["numero_documento"],
                     data["fecha_nacimiento"], data.get("estado_civil", "SOLTERO"), data["genero"],
                     data["cargo"], data.get("departamento"), data.get("jefe_inmediato_id"),
                     data["tipo_contrato"], data["fecha_ingreso"], data["salario_base"],
                     data.get("auxilio_transporte", 0), data.get("bonificacion_fija", 0),
                     data.get("porcentaje_salud", 4), data.get("porcentaje_pension", 4),
                     data.get("tiene_embargo", 0), data.get("valor_embargo", 0)])
                empleado_id = cursor.lastrowid
            return Response(_one("SELECT * FROM empleado WHERE id_empleado = %s", [empleado_id]), status=201)
        except Exception as exc:
            return Response({"error": str(exc)}, status=400)


class PagoEmpleadoView(APIView):
    def get(self, request):
        sql = "SELECT * FROM pago_empleado ORDER BY periodo_fin DESC"
        estado = request.query_params.get("estado")
        if estado:
            sql = "SELECT * FROM pago_empleado WHERE estado_pago = %s ORDER BY periodo_fin DESC"
            return Response(_json_rows(sql, [estado]))
        return Response(_json_rows(sql))

    def post(self, request):
        data = request.data
        errors = _required(data, ["id_empleado", "periodo_inicio", "periodo_fin", "fecha_programada"])
        if errors:
            return Response(errors, status=400)
        try:
            empleado = _one("SELECT salario_base, auxilio_transporte, bonificacion_fija, porcentaje_salud, porcentaje_pension, tiene_embargo, valor_embargo FROM empleado WHERE id_empleado = %s", [data["id_empleado"]])
            if not empleado:
                return Response({"error": "Empleado no encontrado."}, status=404)
            devengado = float(empleado["salario_base"] + empleado["auxilio_transporte"] + empleado["bonificacion_fija"])
            deducciones = float(empleado["salario_base"] * (empleado["porcentaje_salud"] + empleado["porcentaje_pension"]) / 100 + (empleado["valor_embargo"] if empleado["tiene_embargo"] else 0))
            with connection.cursor() as cursor:
                cursor.execute("""INSERT INTO pago_empleado
                    (id_empleado, periodo_inicio, periodo_fin, fecha_programada,
                     estado_pago, total_devengado, total_deducciones, total_pagar)
                    VALUES (%s,%s,%s,%s,'Pendiente',%s,%s,%s)""",
                    [data["id_empleado"], data["periodo_inicio"], data["periodo_fin"],
                     data["fecha_programada"], devengado, deducciones, devengado - deducciones])
                pago_id = cursor.lastrowid
            return Response(_one("SELECT * FROM pago_empleado WHERE id_pago_empleado = %s", [pago_id]), status=201)
        except Exception as exc:
            return Response({"error": str(exc)}, status=400)


class MantenimientoView(APIView):
    def get(self, request):
        return Response(_json_rows("""SELECT m.*, u.nombre_usuario, a.nombre_articulo
            FROM mantenimiento m
            JOIN usuario u ON u.id_usuario = m.id_usuario_mecanico
            LEFT JOIN articulo a ON a.id_articulo = m.id_articulo
            ORDER BY m.id_mantenimiento DESC"""))

    def post(self, request):
        data = request.data
        errors = _required(data, ["id_usuario_mecanico", "descripcion", "fecha_inicio"])
        if errors:
            return Response(errors, status=400)
        if data.get("estado", "En proceso") not in {"En proceso", "Reparado", "Devuelto"}:
            return Response({"estado": "Estado de mantenimiento inválido."}, status=400)
        try:
            with connection.cursor() as cursor:
                cursor.execute("""INSERT INTO mantenimiento
                    (id_usuario_mecanico, id_articulo, descripcion, fecha_inicio, fecha_finalizacion, estado)
                    VALUES (%s,%s,%s,%s,%s,%s)""",
                    [data["id_usuario_mecanico"], data.get("id_articulo"), data["descripcion"],
                     data["fecha_inicio"], data.get("fecha_finalizacion"), data.get("estado", "En proceso")])
                item_id = cursor.lastrowid
            return Response(_one("SELECT * FROM mantenimiento WHERE id_mantenimiento = %s", [item_id]), status=201)
        except Exception as exc:
            return Response({"error": str(exc)}, status=400)

    def patch(self, request):
        item_id = request.data.get("id_mantenimiento")
        estado = request.data.get("estado")
        if not item_id or estado not in {"En proceso", "Reparado", "Devuelto"}:
            return Response({"error": "Identificador y estado válido son obligatorios."}, status=400)
        with connection.cursor() as cursor:
            cursor.execute("UPDATE mantenimiento SET estado = %s, fecha_finalizacion = %s WHERE id_mantenimiento = %s", [estado, request.data.get("fecha_finalizacion"), item_id])
        return Response(_one("SELECT * FROM mantenimiento WHERE id_mantenimiento = %s", [item_id]))
