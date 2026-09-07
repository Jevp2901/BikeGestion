from rest_framework.permissions import BasePermission
from backend.models.models import Usuario


def _role_value(user):
    return getattr(user, "rol", getattr(user, "id_rol", None))


class IsAdmin(BasePermission):
    message = "Se requiere rol de administrador."

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return False
        role = _role_value(user)
        return bool(user.is_staff or user.is_superuser or role in {2, "2", "Administrador"})


class IsVendor(BasePermission):
    message = "Se requiere rol de ventas."

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return False
        role = _role_value(user)
        return bool(role in {1, "1", "Vendedor"})


class IsMechanic(BasePermission):
    message = "Se requiere rol de mecánica."

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return False
        role = _role_value(user)
        return bool(role in {3, "3", "Mecanico"})


class IsMechanicSession(BasePermission):
    """Protects maintenance requests using the app's current session contract."""

    message = "Se requiere una sesión válida de mecánico."

    def has_permission(self, request, view):
        user_id = request.headers.get("X-User-ID")
        if not user_id:
            return False
        try:
            user = Usuario.objects.get(id_usuario=int(user_id))
        except (TypeError, ValueError, Usuario.DoesNotExist):
            return False
        if int(user.id_rol) != 3:
            return False
        request.maintenance_user = user
        return True
