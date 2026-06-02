import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { obtenerSesion } from "../utils/sesion";
import "../App.css";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard", end: true },
  { to: "/inventario", label: "Inventario", icon: "inventory_2" },
  { to: "/venta", label: "Ventas/Cotizaciones", icon: "receipt_long" },
  { to: "/compras", label: "Compras/Proveedores", icon: "shopping_cart" },
  { to: "/empleados", label: "Empleados", icon: "badge" },
  { to: "/reportes", label: "Reportes", icon: "assessment" },
];

function PanelLayout() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUsuario(obtenerSesion());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("sesion_activa");
    navigate("/inicio_sesion", { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-3 transition-colors duration-200 group ${
      isActive
        ? "border-r-2 border-[#fde01a] bg-linear-to-r from-[#fde01a]/10 to-transparent"
        : "hover:bg-[#353534]/40"
    }`;

  const rolId = Number(usuario?.rol);

  return (
    <div className="text-white bg-background text-on-background font-body min-h-screen">
      <aside className="fixed inset-y-0 left-0 w-80 bg-[#131313] border-r border-[#353534]/15 flex flex-col py-6 z-50">
        <div className="px-6 mb-10">
          <h1 className="text-white italic font-bold tracking-tighter text-2xl headline-kinetic">
            Gestión de <span className="text-yellow-300">Tienda</span>
          </h1>
          <p className="text-white text-on-surface-variant text-xs font-medium uppercase tracking-widest mt-1">
            Gestión Profesional
          </p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={navLinkClass}
            >
              <span className="material-symbols-outlined mr-3 text-[#fde01a]">
                {item.icon}
              </span>
              <span className="text-sm font-semibold text-[#e5e2e1]">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <header className="fixed top-0 right-0 left-80 h-16 bg-[#131313] border-r border-[#353534]/15 backdrop-blur-xl z-40 flex justify-between items-center px-8 border-b">
        <div className="flex items-center gap-6">
          <span className="font-headline font-black text-white text-2xl italic tracking-widest">
            Bike<span className="text-yellow-300">Gestión</span>
          </span>
          <div className="h-6 w-px bg-outline-variant/20" />
          <div className="flex items-center gap-2 text-[#fde01a] font-bold">
            <span className="material-symbols-outlined text-sm">store</span>
            <span className="text-sm font-bold text-[#fde01a]">Tienda Principal</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-3">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#fde01a] text-2xl">
                account_circle
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-on-surface">
                {usuario?.nombre}
              </span>
              <span className="text-[10px] text-on-surface-variant">
                {rolId === 2
                  ? "Administrador"
                  : rolId === 1
                    ? "Empleado"
                    : "Usuario"}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-[10px] text-[#fde01a] font-bold uppercase tracking-wider mt-1 hover:underline text-left"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="bg-black/90 ml-80 pt-24 px-8 pb-12 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default PanelLayout;
