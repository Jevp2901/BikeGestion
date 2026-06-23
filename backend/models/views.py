from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound, ValidationError
from django.contrib.auth.hashers import check_password
from datetime import datetime

from .models import Usuario, Articulo
from .movimientos_store import (
    list_movimientos,
    get_movimiento,
    registrar_movimiento,
    revertir_movimiento,
)
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
            
            # Usar check_password para comparar contraseñas encriptadas
            if check_password(contrasena, usuario.contrasena):
                return Response({
                    "mensaje": "Inicio de sesión exitoso",
                    "usuario": usuario_response(usuario)
                }, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "Contraseña incorrecta"},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        
        except Usuario.DoesNotExist:
            return Response(
                {"error": "Usuario no encontrado"},
                status=status.HTTP_404_NOT_FOUND
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
        articulos = Articulo.objects.all().order_by('-id_articulo')
        serializer = ArticuloSerializer(articulos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

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
        articulo = self.get_object(id_articulo)
        if not articulo:
            return Response({'error': 'Artículo no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ArticuloSerializer(articulo, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id_articulo):
        articulo = self.get_object(id_articulo)
        if not articulo:
            return Response({'error': 'Artículo no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        articulo.delete()
        return Response({'mensaje': 'Artículo eliminado correctamente'}, status=status.HTTP_204_NO_CONTENT)


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
        serializer = MovimientoInventarioSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            movimiento = registrar_movimiento(**serializer.validated_data)
        except ValidationError as exc:
            return Response(exc.detail, status=status.HTTP_400_BAD_REQUEST)
        except NotFound as exc:
            return Response({"error": str(exc)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        respuesta = MovimientoInventarioSerializer(movimiento).data
        return Response(respuesta, status=status.HTTP_201_CREATED)


class MovimientoInventarioDetailView(APIView):
    def get_object(self, id_movimiento):
        return get_movimiento(id_movimiento)

    def get(self, request, id_movimiento):
        movimiento = self.get_object(id_movimiento)
        if not movimiento:
            return Response({"error": "Movimiento no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        return Response(movimiento, status=status.HTTP_200_OK)

    def delete(self, request, id_movimiento):
        try:
            movimiento = revertir_movimiento(id_movimiento)
        except ValidationError as exc:
            return Response(exc.detail, status=status.HTTP_400_BAD_REQUEST)
        except NotFound as exc:
            return Response({"error": str(exc)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(status=status.HTTP_204_NO_CONTENT)


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

