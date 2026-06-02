from django.db import models
# Create your models here.
"""Clase de Usuario"""
class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    id_rol = models.IntegerField()
    nombre_usuario = models.CharField(max_length=50)
    telefono = models.CharField(max_length=20)
    correo = models.EmailField(max_length=50)
    contrasena = models.CharField(max_length=255, db_column='contraseña')
    direccion = models.CharField(max_length=50)
    
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
