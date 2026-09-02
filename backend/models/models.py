from django.db import models
# Create your models here.
"""Clase de Usuario"""
class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    id_rol = models.IntegerField()
    nombre_usuario = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20)
    correo = models.EmailField(max_length=254)
    contrasena = models.CharField(max_length=255)
    direccion = models.CharField(max_length=150)
    
    class Meta:
        db_table = 'usuario'
    
    def __str__(self):
        return self.nombre_usuario
    
"""Clase de Rol"""  
class Rol(models.Model):
    id_rol = models.AutoField(primary_key=True)
    nombre_rol = models.CharField(max_length=50)
    permisos = models.CharField(max_length=50)
    
    class Meta:
        db_table = 'rol'
    
    def __str__(self):
        return self.nombre_rol

"""Clase de Inventario"""
class Inventario(models.Model):
    id_inventario = models.AutoField(primary_key=True)
    fecha_actualizacion = models.DateField()
    stock_maximo = models.IntegerField()
    stock_minimo = models.IntegerField()
    cantidad_actual = models.IntegerField()
    
    class Meta:
        db_table = 'inventario'
    
    def __str__(self):
        return f"Inventario {self.id_inventario}"

class Articulo(models.Model):
    id_articulo = models.AutoField(primary_key=True)
    nombre_articulo = models.CharField(max_length=100)
    descripcion_articulo = models.CharField(max_length=255, null=True, blank=True)
    tipo_articulo = models.CharField(max_length=50)
    material = models.CharField(max_length=50, null=True, blank=True)
    color = models.CharField(max_length=80, null=True, blank=True)
    tamano = models.CharField(max_length=50, null=True, blank=True, db_column='tamano')
    precio_articulo = models.DecimalField(max_digits=12, decimal_places=2)
    porcentaje_ganancia = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'articulo'
        managed = False

    def __str__(self):
        return self.nombre_articulo


class InventarioArticulo(models.Model):
    id_inventario_articulo = models.AutoField(primary_key=True)
    id_inventario = models.IntegerField()
    id_articulo = models.IntegerField()
    cantidad_actual = models.IntegerField(default=0)
    stock_minimo = models.IntegerField(default=0)
    stock_maximo = models.IntegerField(default=0)
    entrada = models.IntegerField(default=0)
    salida = models.IntegerField(default=0)
    fecha_actualizacion = models.DateField()

    class Meta:
        db_table = 'inventario_articulo'
        managed = False


class MovimientoInventario(models.Model):
    id_movimiento = models.AutoField(primary_key=True)
    id_articulo = models.IntegerField()
    id_usuario = models.IntegerField()
    tipo_movimiento = models.CharField(max_length=10)
    cantidad = models.IntegerField()
    razon = models.CharField(max_length=20)
    observaciones = models.TextField(null=True, blank=True)
    fecha_movimiento = models.DateTimeField()

    class Meta:
        db_table = 'movimiento_inventario'
        managed = False

    def __str__(self):
        return f"{self.tipo_movimiento} - Artículo {self.id_articulo} ({self.cantidad})"
