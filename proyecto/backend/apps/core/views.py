from django.http import JsonResponse


def api_root(request):
    return JsonResponse(
        {
            "status": "ok",
            "version": "v1",
            "roles": ["Administrador", "Vendedor", "Mecanico"],
            "modules": [
                "inventario",
                "cotizacion",
                "ventas",
                "compras",
                "proveedores",
                "empleados",
                "usuarios",
                "reportes",
            ],
        }
    )
