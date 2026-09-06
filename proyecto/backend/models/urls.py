from django.urls import path
from .views import (
    RegistrarUsuario,
    LoginUsuario,
    EditarUsuarioView,
    ArticuloListCreateView,
    ArticuloDetailView,
    InventarioAlertasView,
    MovimientoInventarioListCreateView,
    MovimientoInventarioDetailView,
    HistorialArticuloView,
)

urlpatterns = [
    path('api/registrar/', RegistrarUsuario.as_view(), name='registrar-usuario'),
    path('api/login/', LoginUsuario.as_view(), name='login-usuario'),
    path('api/usuario/<int:id_usuario>/', EditarUsuarioView.as_view(), name='editar-usuario'),
    path('api/articulos/', ArticuloListCreateView.as_view(), name='articulo-list-create'),
    path('api/articulos/<int:id_articulo>/', ArticuloDetailView.as_view(), name='articulo-detail'),
    path('api/inventario/alertas/', InventarioAlertasView.as_view(), name='inventario-alertas'),
    path('api/articulos/<int:id_articulo>/historial/', HistorialArticuloView.as_view(), name='historial-articulo'),
    path('api/movimientos/', MovimientoInventarioListCreateView.as_view(), name='movimiento-list-create'),
    path('api/movimientos/<int:id_movimiento>/', MovimientoInventarioDetailView.as_view(), name='movimiento-detail'),
]

