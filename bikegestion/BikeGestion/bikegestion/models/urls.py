from django.urls import path
from .views import RegistrarUsuario, LoginUsuario

urlpatterns = [
    path('api/registrar/', RegistrarUsuario.as_view(), name='registrar-usuario'),
    path('api/login/', LoginUsuario.as_view(), name='login-usuario'),
]
