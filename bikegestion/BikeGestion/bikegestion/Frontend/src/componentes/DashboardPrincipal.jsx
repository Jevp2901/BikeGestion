import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

function DashboardPrincipal() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const usuarioGuardado = localStorage.getItem('usuario');
    const sesionActiva = localStorage.getItem('sesion_activa');

    if (!usuarioGuardado || !sesionActiva) {
      navigate('/inicio_sesion');
      return;
    }

    setUsuario(JSON.parse(usuarioGuardado));
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('sesion_activa');
    navigate('/inicio_sesion');
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full h-20 bg-background/80 backdrop-blur-xl z-50 flex justify-between items-center px-8 border-b border-white/5">
        <div className="font-headline font-black text-white text-2xl italic tracking-widest">
          Bike<span className="text-yellow-300">Gestion</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/70">Bienvenido, {usuario?.nombre}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white text-sm font-semibold transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <section className="mb-12">
            <h1 className="text-4xl font-bold italic text-white mb-4">
              Bienvenido al <span className="text-yellow-300">Dashboard</span>
            </h1>
            <p className="text-white/70 text-lg">
              Gestiona tu tienda de bicicletas de manera eficiente
            </p>
          </section>

          {/* Usuario Info Card */}
          <section className="mb-12 rounded-xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-bold mb-6 text-white">Información del Usuario</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-white/70 text-sm mb-1">Nombre</p>
                <p className="text-white text-lg font-semibold">{usuario?.nombre}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm mb-1">Rol</p>
                <p className="text-white text-lg font-semibold">
                  {usuario?.rol === 1 ? 'Administrador' : usuario?.rol === 2 ? 'Empleado' : 'Usuario'}
                </p>
              </div>
              <div>
                <p className="text-white/70 text-sm mb-1">Correo</p>
                <p className="text-white text-lg font-semibold">{usuario?.correo}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm mb-1">Teléfono</p>
                <p className="text-white text-lg font-semibold">{usuario?.telefono || 'No registrado'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-white/70 text-sm mb-1">Dirección</p>
                <p className="text-white text-lg font-semibold">{usuario?.direccion || 'No registrada'}</p>
              </div>
            </div>
          </section>

          {/* Quick Links */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-white">Accesos Rápidos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to="/"
                className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors text-center"
              >
                <div className="text-4xl mb-3">📦</div>
                <p className="text-white font-semibold">Inventario</p>
              </Link>
              <Link
                to="/"
                className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors text-center"
              >
                <div className="text-4xl mb-3">👥</div>
                <p className="text-white font-semibold">Empleados</p>
              </Link>
              <Link
                to="/"
                className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors text-center"
              >
                <div className="text-4xl mb-3">💰</div>
                <p className="text-white font-semibold">Ventas</p>
              </Link>
              <Link
                to="/"
                className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors text-center"
              >
                <div className="text-4xl mb-3">📊</div>
                <p className="text-white font-semibold">Reportes</p>
              </Link>
            </div>
          </section>

          {/* Stats Section */}
          <section className="rounded-xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-bold mb-6 text-white">Estadísticas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <p className="text-white/70 text-sm mb-2">Total de Productos</p>
                <p className="text-4xl font-bold text-yellow-300">-</p>
              </div>
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <p className="text-white/70 text-sm mb-2">Ventas Este Mes</p>
                <p className="text-4xl font-bold text-yellow-300">-</p>
              </div>
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <p className="text-white/70 text-sm mb-2">Empleados Activos</p>
                <p className="text-4xl font-bold text-yellow-300">-</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default DashboardPrincipal;
