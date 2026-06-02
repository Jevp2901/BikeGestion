from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from .models import Usuario
from .serializers import UsuarioSerializer

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
