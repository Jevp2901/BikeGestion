import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { obtenerSesion } from "../utils/sesion";
import { getRoleName } from "../utils/roles";
import LogoMarca from "./LogoMarca";
import "../App.css";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard", end: true, roles: [1, 2, 3] },
  { to: "/inventario", label: "Inventario", icon: "inventory_2", roles: [1] },
  { to: "/venta", label: "Ventas", icon: "point_of_sale", roles: [1] },
  { to: "/compras", label: "Compras", icon: "local_shipping", roles: [1] },
  { to: "/proveedores", label: "Proveedores", icon: "handshake", roles: [1] },
  { to: "/empleados", label: "Empleados", icon: "badge", roles: [2] },
  { to: "/usuarios", label: "Usuarios y Roles", icon: "group", roles: [2] },
  { to: "/reportes", label: "Reportes BI", icon: "analytics", roles: [2] },
];

function PanelLayout() {
  const [usuario] = useState(() => obtenerSesion());
  const [fotoPerfil] = useState(() => {
    const sesion = obtenerSesion();
    return sesion?.id ? localStorage.getItem(`foto_perfil_usuario_${sesion.id}`) : null;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem("bikegestion_sidebar_collapsed") === "true");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("sesion_activa");
    navigate("/inicio_sesion", { replace: true });
  };

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarCollapsed((value) => {
    localStorage.setItem("bikegestion_sidebar_collapsed", String(!value));
    return !value;
  });

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 group ${
      isActive
        ? "bg-[#ffd700]/10 text-[#ffd700] ring-1 ring-inset ring-[#ffd700]/20"
        : "text-[#e3e2e2] hover:bg-[#1a1a1a] hover:text-[#ffd700]"
    }`;

  const rolId = Number(usuario?.rol);
  const visibleNavItems = NAV_ITEMS.filter((item) => item.roles.includes(rolId));

  return (
    <div className="panel-layout min-h-screen bg-[#050505] text-[#e3e2e2] dot-grid">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#4d4732] bg-[#0d0e0f] px-4 py-6 shadow-2xl shadow-black/40 transition-[width,transform] duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${sidebarCollapsed ? "md:w-20 md:px-3" : "md:w-64 md:px-4"}`}
      >
        <div className={`mb-8 flex items-center justify-between gap-4 ${sidebarCollapsed ? "md:justify-center" : ""}`}>
          <LogoMarca subtitle={!sidebarCollapsed} compact={sidebarCollapsed} />
          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-lg border border-[#333333] p-2 text-[#d0c6ab] transition-colors hover:border-[#ffd700]/50 hover:text-[#ffd700] md:hidden"
            aria-label="Cerrar menú"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        <NavLink
          to={rolId === 1 ? "/venta" : "/dashboard"}
          onClick={closeSidebar}
          aria-disabled={rolId !== 1}
          className={`mb-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#ffd700] px-4 py-3 text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-[#ffe16d] ${sidebarCollapsed ? "md:px-2" : ""}`}
          title={sidebarCollapsed ? (rolId === 1 ? "Nueva Orden" : "Ir al Dashboard") : undefined}
        >
          <span className="material-symbols-outlined">add</span>
          <span className={sidebarCollapsed ? "md:hidden" : ""}>{rolId === 1 ? "Nueva Orden" : "Ir al Dashboard"}</span>
        </NavLink>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={closeSidebar}
              className={(state) => `${navLinkClass(state)} ${sidebarCollapsed ? "md:justify-center md:px-2" : ""}`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <span className="material-symbols-outlined text-sm">{item.icon}</span>
              <span className={sidebarCollapsed ? "md:hidden" : ""}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-2 border-t border-[#4d4732] pt-4">
          <NavLink
            to="/editarusuario"
            onClick={closeSidebar}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#e3e2e2] transition-colors hover:bg-[#1a1a1a] hover:text-[#ffd700] ${sidebarCollapsed ? "md:justify-center md:px-2" : ""}`}
            title={sidebarCollapsed ? "Configuración" : undefined}
          >
            <span className="material-symbols-outlined text-sm">settings</span>
            <span className={sidebarCollapsed ? "md:hidden" : ""}>Configuración</span>
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-[#e3e2e2] transition-colors hover:bg-[#1a1a1a] hover:text-[#ffd700] ${sidebarCollapsed ? "md:justify-center md:px-2" : ""}`}
            title={sidebarCollapsed ? "Cerrar Sesión" : undefined}
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span className={sidebarCollapsed ? "md:hidden" : ""}>Cerrar Sesión</span>
          </button>
          <button type="button" onClick={toggleSidebar} className="hidden w-full items-center justify-center rounded-lg border border-[#292b2b] py-2 text-[#aaa79d] transition hover:border-[#ffd700] hover:text-[#ffd700] md:flex" title={sidebarCollapsed ? "Expandir panel" : "Contraer panel"} aria-label={sidebarCollapsed ? "Expandir panel" : "Contraer panel"}>
            <span className="material-symbols-outlined text-sm">{sidebarCollapsed ? "chevron_right" : "chevron_left"}</span>
          </button>
        </div>
      </aside>

      <header className={`fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[#4d4732] bg-[#0d0e0f]/95 px-4 backdrop-blur md:px-6 ${sidebarCollapsed ? "md:left-20" : "md:left-64"}`}>
        <div className="flex items-center gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg border border-[#333333] p-2 text-[#d0c6ab] transition-colors hover:border-[#ffd700]/50 hover:text-[#ffd700] md:hidden"
            aria-label="Abrir menú"
          >
            <span className="material-symbols-outlined text-sm">menu</span>
          </button>
          <div className="relative hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#d0c6ab]">
              search
            </span>
            <input
              className="w-64 rounded-xl border border-[#333333] bg-[#0a0a0a] py-2 pl-10 pr-4 text-sm text-[#e3e2e2] outline-none transition-all placeholder:text-[#d0c6ab]/50 focus:border-[#ffd700] xl:w-96"
              placeholder="Buscar órdenes, clientes, piezas..."
              type="search"
            />
          </div>
          <div className="md:hidden">
            <LogoMarca size="sm" />
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden items-center gap-2 text-[#ffd700] lg:flex">
            <span className="material-symbols-outlined text-sm">storefront</span>
            <span className="text-xs font-bold uppercase tracking-wider">
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
          <div className="flex items-center gap-3 border-l border-[#4d4732] pl-3 md:pl-4">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-bold text-[#e3e2e2]">
                {usuario?.nombre || "Usuario"}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-[#ffd700]">
                {getRoleName(rolId)}
              </p>
            </div>
            <NavLink
              to="/editarusuario"
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[#4d4732] bg-[#343535]"
              title="Editar usuario"
            >
              {fotoPerfil ? (
                <img
                  src={fotoPerfil}
                  alt="Perfil"
                  className="h-full w-full object-cover"
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

      <main className={`min-h-screen px-4 pb-12 pt-24 md:px-6 ${sidebarCollapsed ? "md:ml-20" : "md:ml-64"}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default PanelLayout;
