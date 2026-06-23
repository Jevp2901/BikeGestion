from rest_framework import serializers
from django.contrib.auth.hashers import make_password, check_password
from .models import Rol, Usuario, Articulo
from .movimientos_store import MOVIMIENTOS_VALIDOS, RAZONES_VALIDAS

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


class UsuarioUpdateSerializer(serializers.ModelSerializer):
    contrasena_actual = serializers.CharField(write_only=True, required=False, allow_blank=True, trim_whitespace=False)
    contrasena = serializers.CharField(write_only=True, required=False, allow_blank=True, trim_whitespace=False)
    contrasena_confirmacion = serializers.CharField(write_only=True, required=False, allow_blank=True, trim_whitespace=False)

    class Meta:
        model = Usuario
        fields = [
            'id_usuario',
            'nombre_usuario',
            'id_rol',
            'telefono',
            'correo',
            'contrasena_actual',
            'contrasena',
            'contrasena_confirmacion',
            'direccion',
        ]
        read_only_fields = ['id_usuario']

    def validate_nombre_usuario(self, value):
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError('El nombre debe tener al menos 3 caracteres.')
        
        queryset = Usuario.objects.filter(nombre_usuario__iexact=value)
        if self.instance:
            queryset = queryset.exclude(id_usuario=self.instance.id_usuario)
        if queryset.exists():
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
        queryset = Usuario.objects.filter(correo__iexact=value)
        if self.instance:
            queryset = queryset.exclude(id_usuario=self.instance.id_usuario)
        if queryset.exists():
            raise serializers.ValidationError('Este correo ya está registrado.')
        return value

    def validate_direccion(self, value):
        value = value.strip()
        if len(value) < 5:
            raise serializers.ValidationError('La dirección debe tener al menos 5 caracteres.')
        return value

    def validate(self, attrs):
        contrasena_actual = attrs.get('contrasena_actual')
        contrasena = attrs.get('contrasena')
        contrasena_confirmacion = attrs.get('contrasena_confirmacion')

        # Si el usuario intenta cambiar la contraseña (al menos un campo de contraseña tiene texto)
        if contrasena_actual or contrasena or contrasena_confirmacion:
            if not contrasena_actual:
                raise serializers.ValidationError({'contrasena_actual': 'La contraseña actual es obligatoria para realizar cambios.'})
            if not contrasena:
                raise serializers.ValidationError({'contrasena': 'La nueva contraseña es obligatoria.'})
            if not contrasena_confirmacion:
                raise serializers.ValidationError({'contrasena_confirmacion': 'La confirmación de la contraseña es obligatoria.'})

            if self.instance and not check_password(contrasena_actual, self.instance.contrasena):
                raise serializers.ValidationError({'contrasena_actual': 'La contraseña actual es incorrecta.'})

            if contrasena != contrasena_confirmacion:
                raise serializers.ValidationError({'contrasena_confirmacion': 'Las contraseñas no coinciden.'})

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

    def update(self, instance, validated_data):
        # Extraer los campos write-only de contraseña
        validated_data.pop('contrasena_actual', None)
        contrasena = validated_data.pop('contrasena', None)
        validated_data.pop('contrasena_confirmacion', None)

        # Actualizar campos del modelo
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Hashear y actualizar contraseña si cambió
        if contrasena:
            instance.contrasena = make_password(contrasena)

        instance.save()
        return instance


class ArticuloSerializer(serializers.ModelSerializer):
    class Meta:
        model = Articulo
        fields = '__all__'
        read_only_fields = ['id_articulo']


class MovimientoInventarioSerializer(serializers.Serializer):
    id_movimiento = serializers.IntegerField(read_only=True)
    id_articulo = serializers.IntegerField()
    nombre_articulo = serializers.CharField(read_only=True)
    id_usuario = serializers.IntegerField()
    nombre_usuario = serializers.CharField(read_only=True)
    tipo_movimiento = serializers.ChoiceField(choices=MOVIMIENTOS_VALIDOS)
    cantidad = serializers.IntegerField()
    razon = serializers.ChoiceField(choices=RAZONES_VALIDAS)
    fecha_movimiento = serializers.CharField(read_only=True)
    observaciones = serializers.CharField(allow_blank=True, allow_null=True, required=False)
    nuevo_stock = serializers.IntegerField(read_only=True)
    stock_actualizado_a = serializers.IntegerField(read_only=True)
    stock_anterior = serializers.IntegerField(read_only=True)

    def validate_id_articulo(self, value):
        if not Articulo.objects.filter(id_articulo=value).exists():
            raise serializers.ValidationError("Artículo no encontrado.")
        return value

    def validate_id_usuario(self, value):
        if not Usuario.objects.filter(id_usuario=value).exists():
            raise serializers.ValidationError("Usuario no encontrado.")
        return value

    def validate_cantidad(self, value):
        if value <= 0:
            raise serializers.ValidationError("Cantidad debe ser mayor a 0.")
        return value

    def validate_observaciones(self, value):
        if value is None:
            return value
        value = value.strip()
        if len(value) > 200:
            raise serializers.ValidationError("Las observaciones no pueden superar 200 caracteres.")
        return value


