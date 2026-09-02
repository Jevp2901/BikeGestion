from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from .models import Rol, Usuario

class EditarUsuarioTests(TestCase):
    def setUp(self):
        # Create roles
        self.role_vendedor = Rol.objects.create(id_rol=1, nombre_rol="Vendedor", permisos="lectura,escritura")
        self.role_admin = Rol.objects.create(id_rol=2, nombre_rol="Administrador", permisos="todos")
        
        # Create test user
        self.user = Usuario.objects.create(
            nombre_usuario="testuser",
            id_rol=1,
            telefono="1234567890",
            correo="test@example.com",
            contrasena=make_password("OldPassword123"),
            direccion="Calle Falsa 123"
        )
        self.url = reverse('editar-usuario', kwargs={'id_usuario': self.user.id_usuario})

    def test_get_user_success(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['usuario']['nombre'], "testuser")
        self.assertEqual(response.data['usuario']['correo'], "test@example.com")

    def test_get_user_not_found(self):
        url_invalid = reverse('editar-usuario', kwargs={'id_usuario': 99999})
        response = self.client.get(url_invalid)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_personal_info(self):
        data = {
            "nombre_usuario": "updateduser",
            "telefono": "0987654321",
            "correo": "updated@example.com",
            "direccion": "Avenida Siempre Viva 742",
            "id_rol": 2
        }
        response = self.client.patch(self.url, data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.nombre_usuario, "updateduser")
        self.assertEqual(self.user.telefono, "0987654321")
        self.assertEqual(self.user.correo, "updated@example.com")
        self.assertEqual(self.user.direccion, "Avenida Siempre Viva 742")
        self.assertEqual(self.user.id_rol, 2)

    def test_update_password_incorrect_current(self):
        data = {
            "contrasena_actual": "WrongOldPassword",
            "contrasena": "NewPassword123",
            "contrasena_confirmacion": "NewPassword123"
        }
        response = self.client.patch(self.url, data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('contrasena_actual', response.data['errores'])

    def test_update_password_mismatched_confirm(self):
        data = {
            "contrasena_actual": "OldPassword123",
            "contrasena": "NewPassword123",
            "contrasena_confirmacion": "NewPassword999"
        }
        response = self.client.patch(self.url, data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('contrasena_confirmacion', response.data['errores'])

    def test_update_password_weak(self):
        data = {
            "contrasena_actual": "OldPassword123",
            "contrasena": "weak",
            "contrasena_confirmacion": "weak"
        }
        response = self.client.patch(self.url, data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('contrasena', response.data['errores'])

    def test_update_password_success(self):
        data = {
            "contrasena_actual": "OldPassword123",
            "contrasena": "NewPassword123",
            "contrasena_confirmacion": "NewPassword123"
        }
        response = self.client.patch(self.url, data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(check_password("NewPassword123", self.user.contrasena))

    def test_unique_validation(self):
        # Create another user
        Usuario.objects.create(
            nombre_usuario="otheruser",
            id_rol=1,
            telefono="1111111111",
            correo="other@example.com",
            contrasena=make_password("SomePassword123"),
            direccion="Calle 456"
        )
        # Try to rename self.user to "otheruser"
        data = {
            "nombre_usuario": "otheruser"
        }
        response = self.client.patch(self.url, data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('nombre_usuario', response.data['errores'])
