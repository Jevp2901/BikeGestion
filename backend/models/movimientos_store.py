import json
from pathlib import Path
from typing import Any

from django.conf import settings
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import NotFound, ValidationError

from .models import Articulo, InventarioArticulo, Usuario

MOVIMIENTOS_VALIDOS = ("Entrada", "Salida")
RAZONES_VALIDAS = ("Compra", "Venta", "Ajuste", "Pérdida", "Devolución", "Otro")
MOVIMIENTOS_PATH = Path(settings.BASE_DIR) / "backend" / "data" / "movimientos_inventario.json"


def ensure_storage() -> None:
    MOVIMIENTOS_PATH.parent.mkdir(parents=True, exist_ok=True)
    if not MOVIMIENTOS_PATH.exists():
        MOVIMIENTOS_PATH.write_text("[]", encoding="utf-8")


def _load_raw() -> list[dict[str, Any]]:
    ensure_storage()
    try:
        with MOVIMIENTOS_PATH.open("r", encoding="utf-8") as handle:
            data = json.load(handle)
            return data if isinstance(data, list) else []
    except json.JSONDecodeError:
        return []


def _save_raw(items: list[dict[str, Any]]) -> None:
    ensure_storage()
    tmp_path = MOVIMIENTOS_PATH.with_suffix(".json.tmp")
    with tmp_path.open("w", encoding="utf-8") as handle:
        json.dump(items, handle, ensure_ascii=False, indent=2)
    tmp_path.replace(MOVIMIENTOS_PATH)


def list_movimientos() -> list[dict[str, Any]]:
    return _load_raw()


def get_movimiento(id_movimiento: int) -> dict[str, Any] | None:
    for item in _load_raw():
        if int(item.get("id_movimiento", 0)) == int(id_movimiento):
            return item
    return None


def save_movimiento(movimiento: dict[str, Any]) -> dict[str, Any]:
    items = _load_raw()
    next_id = max((int(item.get("id_movimiento", 0)) for item in items), default=0) + 1
    movimiento["id_movimiento"] = next_id
    items.append(movimiento)
    _save_raw(items)
    return movimiento


def delete_movimiento(id_movimiento: int) -> dict[str, Any]:
    items = _load_raw()
    remaining = []
    deleted = None
    for item in items:
        if int(item.get("id_movimiento", 0)) == int(id_movimiento):
            deleted = item
            continue
        remaining.append(item)

    if deleted is None:
        raise NotFound("Movimiento no encontrado")

    _save_raw(remaining)
    return deleted


def _to_int(value: Any, field_name: str) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        raise ValidationError({field_name: "Debe ser un número entero válido."})


def registrar_movimiento(
    *,
    id_articulo: Any,
    id_usuario: Any,
    tipo_movimiento: str,
    cantidad: Any,
    razon: str,
    observaciones: str | None = None,
) -> dict[str, Any]:
    id_articulo = _to_int(id_articulo, "id_articulo")
    id_usuario = _to_int(id_usuario, "id_usuario")
    cantidad = _to_int(cantidad, "cantidad")
    tipo_movimiento = (tipo_movimiento or "").strip().title()
    razon = (razon or "").strip().title()
    observaciones = (observaciones or "").strip() or None

    if cantidad <= 0:
        raise ValidationError({"cantidad": "Cantidad debe ser mayor a 0."})
    if tipo_movimiento not in MOVIMIENTOS_VALIDOS:
        raise ValidationError({"tipo_movimiento": "Tipo debe ser Entrada o Salida."})
    if razon not in RAZONES_VALIDAS:
        raise ValidationError({"razon": "Razón inválida."})

    try:
        usuario = Usuario.objects.get(id_usuario=id_usuario)
    except Usuario.DoesNotExist:
        raise ValidationError({"id_usuario": "Usuario no encontrado."})

    with transaction.atomic():
        try:
            articulo = Articulo.objects.get(id_articulo=id_articulo)
            inventario_articulo = InventarioArticulo.objects.select_for_update().get(
                id_articulo=id_articulo
            )
        except (Articulo.DoesNotExist, InventarioArticulo.DoesNotExist):
            raise ValidationError({"id_articulo": "Artículo no encontrado."})

        stock_actual = int(inventario_articulo.cantidad_actual or 0)
        if tipo_movimiento == "Salida" and cantidad > stock_actual:
            raise ValidationError(
                {
                    "error": "La cantidad de salida excede el stock disponible",
                    "stock_actual": stock_actual,
                    "cantidad_solicitada": cantidad,
                }
            )

        nuevo_stock = stock_actual + cantidad if tipo_movimiento == "Entrada" else stock_actual - cantidad
        if nuevo_stock < 0:
            raise ValidationError({"error": "El stock no puede quedar en negativo."})

        inventario_articulo.cantidad_actual = nuevo_stock
        if tipo_movimiento == "Entrada":
            inventario_articulo.entrada += cantidad
        else:
            inventario_articulo.salida += cantidad
        inventario_articulo.fecha_actualizacion = timezone.localdate()
        inventario_articulo.save(update_fields=[
            "cantidad_actual",
            "entrada",
            "salida",
            "fecha_actualizacion",
        ])

        movimiento = {
            "id_articulo": articulo.id_articulo,
            "nombre_articulo": articulo.nombre_articulo,
            "id_usuario": usuario.id_usuario,
            "nombre_usuario": usuario.nombre_usuario,
            "tipo_movimiento": tipo_movimiento,
            "cantidad": cantidad,
            "razon": razon,
            "fecha_movimiento": timezone.now().isoformat(),
            "observaciones": observaciones,
            "nuevo_stock": nuevo_stock,
            "stock_actualizado_a": nuevo_stock,
            "stock_anterior": stock_actual,
        }
        return save_movimiento(movimiento)


def revertir_movimiento(id_movimiento: Any) -> dict[str, Any]:
    id_movimiento = _to_int(id_movimiento, "id_movimiento")
    with transaction.atomic():
        movimiento = get_movimiento(id_movimiento)
        if not movimiento:
            raise NotFound("Movimiento no encontrado")

        try:
            articulo = Articulo.objects.get(id_articulo=movimiento["id_articulo"])
            inventario_articulo = InventarioArticulo.objects.select_for_update().get(
                id_articulo=movimiento["id_articulo"]
            )
        except (Articulo.DoesNotExist, InventarioArticulo.DoesNotExist):
            raise ValidationError({"id_articulo": "Artículo no encontrado."})

        stock_actual = int(inventario_articulo.cantidad_actual or 0)
        cantidad = int(movimiento["cantidad"])

        if movimiento["tipo_movimiento"] == "Entrada":
            nuevo_stock = stock_actual - cantidad
        else:
            nuevo_stock = stock_actual + cantidad

        if nuevo_stock < 0:
            raise ValidationError({"error": "No es posible revertir el movimiento porque dejaría el stock en negativo."})

        inventario_articulo.cantidad_actual = nuevo_stock
        if movimiento["tipo_movimiento"] == "Entrada":
            inventario_articulo.entrada = max(0, inventario_articulo.entrada - cantidad)
        else:
            inventario_articulo.salida = max(0, inventario_articulo.salida - cantidad)
        inventario_articulo.fecha_actualizacion = timezone.localdate()
        inventario_articulo.save(update_fields=[
            "cantidad_actual",
            "entrada",
            "salida",
            "fecha_actualizacion",
        ])
        delete_movimiento(id_movimiento)
        movimiento["stock_actualizado_a"] = nuevo_stock
        movimiento["nuevo_stock"] = nuevo_stock
        return movimiento
