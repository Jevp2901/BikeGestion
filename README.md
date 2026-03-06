<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="style.css">
    <title>Registrar nuevo usuario</title>
    
</head>
<body>


<form class="formulario_crear" action="insertar_usuario.php" method="POST">
    <h1 class="crear_usuario">Crear usuario</h1>

    <label>Nombre</label>
    <input class="Contro" type="text" name="Nombre" required><br><br>

    <label>Rol</label>
    <input class="Controles" type="number" name="id_rol" required><br><br>

    <label>Teléfono:</label>
    <input class="Controles" type="number" name="telefono" required><br><br>

    <label>Correo:</label>
    <input class="Controles" type="email" name="correo" required><br><br>

    <label>Contraseña:</label>
    <input class="Controles" type="text" name="contraseña" required><br><br>

    <label>Dirección:</label>
    <input class="Controles" type="text" name="dirección" required><br><br>

    <button class="guardar" type="submit">Guardar</button>

</form>

</body>
</html>
