from django.test import TestCase
from django.contrib.auth.hashers import make_password
from backend.models.models import Usuario, Rol

class UsuarioModelTest(TestCase):
    def setUp(self):
        # Crear roles de prueba (admin, vendedor, mecánico)
        self.rol_admin = Rol.objects.create(nombre_rol='Administrador', permisos='gestion_total')
        self.rol_vendedor = Rol.objects.create(nombre_rol='Vendedor', permisos='ventas_inventario')
        self.rol_mecanico = Rol.objects.create(nombre_rol='Mecánico', permisos='mantenimiento')

    def test_asignacion_rol_y_permisos(self):
        """CP-USER-U-01: Verifica que al crear usuario se asigna rol y permisos correctos"""
        # Probar para cada rol
        for rol_esperado, rol_obj in [
            ('Administrador', self.rol_admin),
            ('Vendedor', self.rol_vendedor),
            ('Mecánico', self.rol_mecanico)
        ]:
            usuario = Usuario.objects.create(
                nombre_usuario='Test User',
                telefono='123456789',
                correo=f'test_{rol_esperado.lower()}@bike.com',
                contrasena=make_password('secure123'),  # Importante: usar hash
                direccion='Calle Falsa 123',
                id_rol=rol_obj.id_rol  # Asignar rol explícitamente
            )

            # Verificar que el rol se guardó correctamente
            self.assertEqual(usuario.id_rol, rol_obj.id_rol)
            self.assertEqual(Rol.objects.get(id_rol=usuario.id_rol).nombre_rol, rol_esperado)
            # Si usas IntegerField para id_rol, verificaría: self.assertEqual(usuario.id_rol, rol_obj.id_rol)