from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Rol, Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    contrasena = serializers.CharField(write_only=True, trim_whitespace=False)
    contrasena_confirmacion = serializers.CharField(write_only=True, trim_whitespace=False)

    class Meta:
        model = Usuario
        fields = [
            'id_usuario',
            'nombre_usuario',
            'id_rol',
            'telefono',
            'correo',
            'contrasena',
            'contrasena_confirmacion',
            'direccion',
        ]
        read_only_fields = ['id_usuario']

    def validate_nombre_usuario(self, value):
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError('El nombre debe tener al menos 3 caracteres.')
        if Usuario.objects.filter(nombre_usuario__iexact=value).exists():
            raise serializers.ValidationError('Este nombre de usuario ya está registrado.')
        return value

    def validate_id_rol(self, value):
        if not Rol.objects.filter(id_rol=value).exists():
            raise serializers.ValidationError('El rol seleccionado no existe.')
        return value

    def validate_telefono(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('El teléfono es obligatorio.')
        digits = ''.join(ch for ch in value if ch.isdigit())
        if len(digits) < 7 or len(digits) > 15:
            raise serializers.ValidationError('El teléfono debe tener entre 7 y 15 dígitos.')
        return value

    def validate_correo(self, value):
        value = value.strip().lower()
        if Usuario.objects.filter(correo__iexact=value).exists():
            raise serializers.ValidationError('Este correo ya está registrado.')
        return value

    def validate_direccion(self, value):
        value = value.strip()
        if len(value) < 5:
            raise serializers.ValidationError('La dirección debe tener al menos 5 caracteres.')
        return value

    def validate(self, attrs):
        contrasena = attrs.get('contrasena', '')
        confirmacion = attrs.pop('contrasena_confirmacion', '')

        if contrasena != confirmacion:
            raise serializers.ValidationError({
                'contrasena_confirmacion': 'Las contraseñas no coinciden.'
            })

        errores = []
        if len(contrasena) < 8:
            errores.append('mínimo 8 caracteres')
        if not any(ch.isupper() for ch in contrasena):
            errores.append('una mayúscula')
        if not any(ch.islower() for ch in contrasena):
            errores.append('una minúscula')
        if not any(ch.isdigit() for ch in contrasena):
            errores.append('un número')

        if errores:
            raise serializers.ValidationError({
                'contrasena': f'La contraseña debe incluir {", ".join(errores)}.'
            })

        return attrs

    def create(self, validated_data):
        validated_data['contrasena'] = make_password(validated_data['contrasena'])
        return Usuario.objects.create(**validated_data)
