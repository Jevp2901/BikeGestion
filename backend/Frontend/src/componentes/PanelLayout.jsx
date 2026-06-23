import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { obtenerSesion } from "../utils/sesion";
import LogoMarca from "./LogoMarca";
import "../App.css";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard", end: true },
  { to: "/inventario", label: "Inventario", icon: "inventory_2" },
  { to: "/venta", label: "Ventas/Cotizaciones", icon: "receipt_long" },
  { to: "/compras", label: "Compras/Proveedores", icon: "local_shipping" },
  { to: "/empleados", label: "Empleados", icon: "badge" },
  { to: "/reportes", label: "Reportes", icon: "analytics" },
];

function PanelLayout() {
  const [usuario, setUsuario] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const sesion = obtenerSesion();
    setUsuario(sesion);
    if (sesion?.id) {
      const savedPhoto = localStorage.getItem(`foto_perfil_usuario_${sesion.id}`);
      if (savedPhoto) {
        setFotoPerfil(savedPhoto);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("sesion_activa");
    navigate("/inicio_sesion", { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 py-3 pl-4 pr-3 font-mono text-sm transition-colors duration-200 group ${
      isActive
        ? "border-l-2 border-[#ffd700] text-[#ffd700] font-bold bg-[#ffd700]/5"
        : "text-white hover:text-[#ffd700] hover:bg-[#292a2a]"
    }`;

  const rolId = Number(usuario?.rol);

  return (
    <div className="min-h-screen bg-black text-[#e3e2e2] font-body dot-grid">
      <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#4d4732] bg-[#0d0e0f] px-4 py-6">
        <div className="mb-8">
          <LogoMarca subtitle />
        </div>

        <NavLink
          to="/venta"
          className="mb-8 flex w-full items-center justify-center gap-2 rounded bg-[#ffd700] px-4 py-3 text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-[#ffe16d]"
        >
          <span className="material-symbols-outlined">add</span>
          Nueva Orden
        </NavLink>

        <nav className="flex-1 space-y-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={navLinkClass}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-2 border-t border-[#4d4732] pt-4">
          <NavLink
            to="/editarusuario"
            className="flex items-center gap-3 py-2 pl-4 pr-3 font-mono text-sm text-white transition-colors hover:bg-[#292a2a] hover:text-[#ffd700]"
          >
            <span className="material-symbols-outlined">settings</span>
            <span>Configuración</span>
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 py-2 pl-4 pr-3 text-left font-mono text-sm text-white transition-colors hover:bg-[#292a2a] hover:text-[#ffd700]"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <header className="fixed left-64 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[#4d4732] bg-[#0d0e0f] px-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#d0c6ab]">
              search
            </span>
            <input
              className="w-64 rounded border border-[#333333] bg-[#0a0a0a] py-2 pl-10 pr-4 font-mono text-sm text-[#e3e2e2] outline-none transition-all placeholder:text-[#d0c6ab]/50 focus:border-[#ffd700] md:w-96"
              placeholder="Buscar órdenes, clientes, piezas..."
              type="search"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-2 text-[#ffd700] md:flex">
            <span className="material-symbols-outlined text-sm">storefront</span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              Tienda Principal - Bogotá
            </span>
          </div>
          <button
            type="button"
            className="relative text-[#d0c6ab] transition-colors hover:text-[#fff6df]"
            aria-label="Notificaciones"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#ffb4ab]" />
          </button>
          <div className="flex items-center gap-3 border-l border-[#4d4732] pl-4">
            <div className="text-right">
              <p className="font-mono text-xs font-bold text-[#e3e2e2]">
                {usuario?.nombre || "Usuario"}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-[#ffd700]">
                {rolId === 2
                  ? "Admin"
                  : rolId === 1
                    ? "Empleado"
                    : "Usuario"}
              </p>
            </div>
            <NavLink
              to="/editarusuario"
              className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-[#4d4732] bg-[#343535]"
              title="Editar usuario"
            >
              {fotoPerfil ? (
                <img
                  src={fotoPerfil}
                  alt="Perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-[#ffd700]">
                  account_circle
                </span>
              )}
            </NavLink>
          </div>
        </div>
      </header>

      <main className="ml-64 min-h-screen px-6 pb-12 pt-24">
        <Outlet />
      </main>
    </div>
  );
}

export default PanelLayout;
