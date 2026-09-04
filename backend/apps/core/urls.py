from django.urls import include, path

from .views import api_root
from .operations import (
    CompraListView,
    ClienteListView,
    CotizacionDetailView,
    CotizacionListView,
    ProveedorDetailView,
    ProveedorListView,
    ReporteView,
    VentaDetailView,
    VentaListView,
    EmpleadoListView,
    PagoEmpleadoView,
    MantenimientoView,
)

urlpatterns = [
    path("", api_root, name="api-root"),
    path("inventario/", include("backend.apps.inventario.urls")),
    path("cotizacion/", include("backend.apps.cotizacion.urls")),
    path("ventas/", include("backend.apps.ventas.urls")),
    path("compras/", include("backend.apps.compras.urls")),
    path("proveedores/", include("backend.apps.proveedores.urls")),
    path("empleados/", include("backend.apps.empleados.urls")),
    path("usuarios/", include("backend.apps.usuarios.urls")),
    path("reportes/", include("backend.apps.reportes.urls")),
    path("proveedores/", ProveedorListView.as_view(), name="proveedor-list"),
    path("clientes/", ClienteListView.as_view(), name="cliente-list"),
    path("proveedores/<int:nit_proveedor>/", ProveedorDetailView.as_view(), name="proveedor-detail"),
    path("cotizaciones/", CotizacionListView.as_view(), name="cotizacion-list"),
    path("cotizaciones/<int:id_cotizacion>/", CotizacionDetailView.as_view(), name="cotizacion-detail"),
    path("compras/", CompraListView.as_view(), name="compra-list"),
    path("ventas/", VentaListView.as_view(), name="venta-list"),
    path("ventas/<int:id_venta>/", VentaDetailView.as_view(), name="venta-detail"),
    path("reportes/datos/", ReporteView.as_view(), name="reporte-datos"),
    path("empleados/", EmpleadoListView.as_view(), name="empleado-list"),
    path("pagos-empleado/", PagoEmpleadoView.as_view(), name="pago-empleado-list"),
    path("usuarios/mantenimiento/", MantenimientoView.as_view(), name="usuario-mantenimiento-list"),
]
