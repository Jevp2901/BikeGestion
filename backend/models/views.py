from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from django.db.models import OuterRef, Subquery
from django.db import connection
from datetime import datetime

from .models import Usuario, Articulo, InventarioArticulo
from .movimientos_store import list_movimientos, get_movimiento
from .serializers import (
    UsuarioSerializer,
    UsuarioUpdateSerializer,
    ArticuloSerializer,
    MovimientoInventarioSerializer,
)

"""Respuesta al usuario"""
def usuario_response(usuario):
    return {
        "id": usuario.id_usuario,
        "nombre": usuario.nombre_usuario,
        "correo": usuario.correo,
        "rol": usuario.id_rol,
        "telefono": usuario.telefono,
        "direccion": usuario.direccion,
    }

# Create your views here.
class RegistrarUsuario(APIView):
    def post(self, request):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            usuario = serializer.save()
            return Response({
                "mensaje": "Registro completado",
                "usuario": usuario_response(usuario),
            }, status=status.HTTP_201_CREATED)
        return Response({
            "mensaje": "No fue posible completar el registro.",
            "errores": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)


class LoginUsuario(APIView):
    def post(self, request):
        nombre_usuario = request.data.get('nombre_usuario')
        contrasena = request.data.get('contrasena')
        
        if not nombre_usuario or not contrasena:
            return Response(
                {"error": "Nombre de usuario y contraseña son requeridos"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            usuario = Usuario.objects.get(nombre_usuario=nombre_usuario)
        except Usuario.DoesNotExist:
            return Response(
                {"error": "Usuario no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Si la contraseña guardada NO tiene formato de hash de Django
        # (p.ej. está en texto plano), intentar comparación directa como
        # fallback. Esto evita el 500 que se produce cuando check_password
        # no puede parsear un valor que no es un hash válido.
        contrasena_guardada = usuario.contrasena or ''
        es_hash_django = (
            contrasena_guardada.startswith('argon2$')
            or contrasena_guardada.startswith('pbkdf2_sha256$')
            or contrasena_guardada.startswith('pbkdf2_sha1$')
            or contrasena_guardada.startswith('bcrypt$')
            or contrasena_guardada.startswith('bcrypt_sha256$')
            or contrasena_guardada.startswith('md5$')
            or contrasena_guardada.startswith('sha1$')
            or contrasena_guardada.startswith('unsalted_sha1$')
            or contrasena_guardada.startswith('crypt$')
        )

        contrasena_valida = False
        try:
            if es_hash_django:
                contrasena_valida = check_password(contrasena, contrasena_guardada)
            else:
                # Texto plano: comparar directamente. NO recomendado para
                # producción; sólo evita el crash con datos legacy.
                contrasena_valida = (contrasena == contrasena_guardada)
        except (ValueError, TypeError):
            contrasena_valida = False

        if contrasena_valida:
            return Response({
                "mensaje": "Inicio de sesión exitoso",
                "usuario": usuario_response(usuario)
            }, status=status.HTTP_200_OK)

        return Response(
            {"error": "Contraseña incorrecta"},
            status=status.HTTP_401_UNAUTHORIZED
        )


class EditarUsuarioView(APIView):
    def get(self, request, id_usuario):
        try:
            usuario = Usuario.objects.get(id_usuario=id_usuario)
            return Response({
                "usuario": usuario_response(usuario)
            }, status=status.HTTP_200_OK)
        except Usuario.DoesNotExist:
            return Response(
                {"error": "Usuario no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

    def patch(self, request, id_usuario):
        try:
            usuario = Usuario.objects.get(id_usuario=id_usuario)
        except Usuario.DoesNotExist:
            return Response(
                {"mensaje": "Usuario no encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = UsuarioUpdateSerializer(usuario, data=request.data, partial=True)
        if serializer.is_valid():
            usuario_actualizado = serializer.save()
            return Response({
                "mensaje": "Usuario actualizado exitosamente",
                "usuario": usuario_response(usuario_actualizado)
            }, status=status.HTTP_200_OK)
        return Response({
            "mensaje": "No fue posible actualizar el usuario.",
            "errores": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id_usuario):
        return self.patch(request, id_usuario)


class ArticuloListCreateView(APIView):
    def get(self, request):
        stock_actual = InventarioArticulo.objects.filter(
            id_articulo=OuterRef('pk')
        ).order_by('-id_inventario_articulo').values('cantidad_actual')[:1]
        articulos = Articulo.objects.annotate(
            cantidad_articulo=Subquery(stock_actual)
        ).filter(activo=True).order_by('-id_articulo')
        serializer = ArticuloSerializer(articulos, many=True)
        resultado = serializer.data
        precios_compra = {}
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT d.id_articulo, d.valor_unitario AS precio_compra
                    FROM detalle_compra d
                    JOIN compra c ON c.id_compra = d.id_compra
                    JOIN (
                        SELECT d2.id_articulo, MAX(CONCAT(c2.fecha_compra, LPAD(c2.id_compra, 10, '0'))) AS ultima_compra
                        FROM detalle_compra d2 JOIN compra c2 ON c2.id_compra = d2.id_compra
                        WHERE c2.estado_compra = 'Realizada'
                        GROUP BY d2.id_articulo
                    ) ult ON ult.id_articulo = d.id_articulo
                        AND ult.ultima_compra = CONCAT(c.fecha_compra, LPAD(c.id_compra, 10, '0'))
                    WHERE c.estado_compra = 'Realizada'
                """)
                precios_compra = {row[0]: row[1] for row in cursor.fetchall()}
        except Exception:
            # El catálogo sigue disponible aunque aún no existan compras históricas.
            precios_compra = {}
        for item in resultado:
            precio_compra = precios_compra.get(item["id_articulo"])
            if precio_compra is None:
                precio_venta = float(item.get("precio_articulo") or 0)
                ganancia = float(item.get("porcentaje_ganancia") or 0)
                precio_compra = round(precio_venta / (1 + ganancia / 100), 2) if precio_venta else 0
            item["precio_compra"] = precio_compra
        return Response(resultado, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ArticuloSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ArticuloDetailView(APIView):
    def get_object(self, id_articulo):
        try:
            return Articulo.objects.get(id_articulo=id_articulo)
        except Articulo.DoesNotExist:
            return None

    def get(self, request, id_articulo):
        articulo = self.get_object(id_articulo)
        if not articulo:
            return Response({'error': 'Artículo no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ArticuloSerializer(articulo)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, id_articulo):
        return Response(
            {'error': 'Los artículos no se pueden editar desde Inventario.'},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    def delete(self, request, id_articulo):
        return Response(
            {'error': 'Los artículos no se pueden eliminar desde Inventario.'},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )


class InventarioAlertasView(APIView):
    """Calcula alertas de stock usando los niveles configurados por artículo."""

    def get(self, request):
        filas = list(
            InventarioArticulo.objects.raw(
                """
                SELECT ia.id_inventario_articulo, ia.id_articulo,
                       ia.cantidad_actual, ia.stock_minimo, ia.stock_maximo,
                       ia.fecha_actualizacion, a.nombre_articulo,
                       a.tipo_articulo, a.precio_articulo,
                       p.nit_proveedor, p.nombre_proveedor
                FROM inventario_articulo ia
                JOIN articulo a ON a.id_articulo = ia.id_articulo
                LEFT JOIN proveedor_articulo pa ON pa.id_articulo = ia.id_articulo
                    AND pa.nit_proveedor = (
                        SELECT MIN(pa2.nit_proveedor)
                        FROM proveedor_articulo pa2
                        JOIN proveedor p2 ON p2.nit_proveedor = pa2.nit_proveedor
                        WHERE pa2.id_articulo = ia.id_articulo AND p2.estado = 'Activo'
                    )
                LEFT JOIN proveedor p ON p.nit_proveedor = pa.nit_proveedor
                WHERE a.activo = 1
                ORDER BY ia.cantidad_actual ASC, a.nombre_articulo ASC
                """
            )
        )
        alertas = []
        for fila in filas:
            minimo = int(fila.stock_minimo or 0)
            actual = int(fila.cantidad_actual or 0)
            maximo = int(fila.stock_maximo or minimo)
            if minimo <= 0 or actual > minimo * 0.75:
                continue
            ratio = actual / minimo
            nivel = "Crítico" if ratio <= 0.25 else "Reposición"
            sugerencia = max(0, maximo - actual) if maximo > 0 else max(0, minimo - actual)
            alertas.append({
                "id_articulo": fila.id_articulo,
                "nombre_articulo": fila.nombre_articulo,
                "tipo_articulo": fila.tipo_articulo,
                "stock_actual": actual,
                "stock_minimo": minimo,
                "stock_maximo": maximo,
                "porcentaje_stock": round(ratio * 100, 1),
                "nivel": nivel,
                "sugerencia_reposicion": sugerencia,
                "inversion_estimada": float(sugerencia * (fila.precio_articulo or 0)),
                "nit_proveedor": fila.nit_proveedor,
                "nombre_proveedor": fila.nombre_proveedor,
                "fecha_actualizacion": fila.fecha_actualizacion,
            })
        return Response({
            "alertas": alertas,
            "resumen": {
                "criticas": sum(item["nivel"] == "Crítico" for item in alertas),
                "reposicion": sum(item["nivel"] == "Reposición" for item in alertas),
                "inversion_estimada": sum(item["inversion_estimada"] for item in alertas),
                "unidades_sugeridas": sum(item["sugerencia_reposicion"] for item in alertas),
            },
        })


def _parse_iso_date(value):
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace('Z', '+00:00')).date()
    except ValueError:
        return None


def _sort_movimientos_desc(movimientos):
    return sorted(
        movimientos,
        key=lambda item: item.get('fecha_movimiento', ''),
        reverse=True,
    )


def _filtrar_por_fecha(movimientos, fecha_desde=None, fecha_hasta=None):
    if not fecha_desde and not fecha_hasta:
        return movimientos

    filtrados = []
    for movimiento in movimientos:
        fecha_movimiento = _parse_iso_date(movimiento.get('fecha_movimiento'))
        if not fecha_movimiento:
            continue
        if fecha_desde and fecha_movimiento < fecha_desde:
            continue
        if fecha_hasta and fecha_movimiento > fecha_hasta:
            continue
        filtrados.append(movimiento)
    return filtrados


class MovimientoInventarioListCreateView(APIView):
    def get(self, request):
        movimientos = list_movimientos()
        limit = request.query_params.get('limit')

        id_articulo = request.query_params.get('id_articulo')
        tipo = request.query_params.get('tipo') or request.query_params.get('tipo_movimiento')
        fecha_desde = _parse_iso_date(request.query_params.get('fecha_desde'))
        fecha_hasta = _parse_iso_date(request.query_params.get('fecha_hasta'))

        if id_articulo:
            movimientos = [m for m in movimientos if str(m.get('id_articulo')) == str(id_articulo)]
        if tipo:
            tipo_normalizado = tipo.strip().title()
            movimientos = [m for m in movimientos if m.get('tipo_movimiento') == tipo_normalizado]
        movimientos = _filtrar_por_fecha(movimientos, fecha_desde=fecha_desde, fecha_hasta=fecha_hasta)

        movimientos = _sort_movimientos_desc(movimientos)
        if limit:
            try:
                movimientos = movimientos[: max(1, int(limit))]
            except ValueError:
                movimientos = movimientos[:50]
        else:
            movimientos = movimientos[:50]
        return Response(movimientos, status=status.HTTP_200_OK)

    def post(self, request):
        return Response(
            {"error": "Los movimientos se generan automáticamente desde compras, ventas y devoluciones."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )


class MovimientoInventarioDetailView(APIView):
    def get_object(self, id_movimiento):
        return get_movimiento(id_movimiento)

    def get(self, request, id_movimiento):
        movimiento = self.get_object(id_movimiento)
        if not movimiento:
            return Response({"error": "Movimiento no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        return Response(movimiento, status=status.HTTP_200_OK)

    def delete(self, request, id_movimiento):
        return Response(
            {"error": "Los movimientos son inmutables y no se pueden eliminar."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )


class HistorialArticuloView(APIView):
    def get(self, request, id_articulo):
        try:
            Articulo.objects.get(id_articulo=id_articulo)
        except Articulo.DoesNotExist:
            return Response({"error": "Artículo no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        movimientos = [
            movimiento for movimiento in list_movimientos()
            if str(movimiento.get("id_articulo")) == str(id_articulo)
        ]
        movimientos = _sort_movimientos_desc(movimientos)[:50]
        historial = [
            {
                "id_movimiento": item.get("id_movimiento"),
                "tipo_movimiento": item.get("tipo_movimiento"),
                "cantidad": item.get("cantidad"),
                "razon": item.get("razon"),
                "fecha_movimiento": item.get("fecha_movimiento"),
                "usuario": item.get("nombre_usuario"),
                "observaciones": item.get("observaciones"),
            }
            for item in movimientos
        ]
        return Response(historial, status=status.HTTP_200_OK)

