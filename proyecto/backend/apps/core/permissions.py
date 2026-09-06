from rest_framework.permissions import BasePermission


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
