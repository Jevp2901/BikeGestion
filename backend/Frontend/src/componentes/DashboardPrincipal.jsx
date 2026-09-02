import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LogoMarca from './LogoMarca';
import { getRoleName } from '../utils/roles';
import '../App.css';

function DashboardPrincipal() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const rolId = Number(usuario?.rol);
  const quickLinks = rolId === 1
    ? [
        { to: "/inventario", label: "Inventario", emoji: "📦" },
        { to: "/venta", label: "Ventas", emoji: "💰" },
        { to: "/cotizacion", label: "Cotizaciones", emoji: "📝" },
        { to: "/compras", label: "Compras", emoji: "🚚" },
        { to: "/proveedores", label: "Proveedores", emoji: "🤝" },
      ]
    : rolId === 2
      ? [
          { to: "/empleados", label: "Empleados", emoji: "👥" },
          { to: "/reportes", label: "Reportes", emoji: "📊" },
        ]
      : [];

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
      <header className="fixed top-0 w-full h-20 bg-black/80 backdrop-blur-xl z-50 flex justify-between items-center px-8 border-b border-white/5">
        <LogoMarca subtitle />

        <div className="flex items-center gap-6">
          {/* Perfil de Usuario con Diseño Solicitado */}
          <div className="flex items-center gap-3 select-none">
            <div className="text-right">
              <p className="text-white font-bold text-base tracking-wide leading-tight">
                {usuario?.nombre || 'Andres'}
              </p>
              <p className="text-white/60 text-xs font-medium tracking-wider">
                {getRoleName(rolId)}
              </p>
            </div>

            {/* Avatar circular amarillo */}
            <div className="w-11 h-11 rounded-full border-2 border-yellow-400 flex items-center justify-center text-yellow-400 bg-transparent">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
          </div>

          <div className="h-8 w-px bg-white/10"></div>

          {/* Botón de Cerrar Sesión */}
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
                  {getRoleName(rolId)}
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
            <div className={`grid grid-cols-1 gap-4 ${quickLinks.length > 2 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-2'}`}>
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="rounded-xl border border-white/10 bg-white/5 p-6 text-center transition-colors hover:bg-white/10"
                >
                  <div className="mb-3 text-4xl">{link.emoji}</div>
                  <p className="font-semibold text-white">{link.label}</p>
                </Link>
              ))}
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
