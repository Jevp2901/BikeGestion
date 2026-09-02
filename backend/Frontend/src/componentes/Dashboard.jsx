import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerSesion } from "../utils/sesion";
import { getRoleName } from "../utils/roles";
import "../App.css";

const kpis = [
  {
    title: "Ventas Totales (Mes)",
    value: "$45,230.00",
    icon: "payments",
    trendIcon: "trending_up",
    trend: "+12.5% vs mes anterior",
    trendClass: "text-[#4ADE80]",
    chart: "line",
  },
  {
    title: "Órdenes Taller Activas",
    value: "24",
    icon: "build",
    trendIcon: "warning",
    trend: "5 con retraso",
    trendClass: "text-[#ffb4ab]",
    chart: "bars",
  },
  {
    title: "Valor Inventario",
    value: "$142,500",
    icon: "inventory",
    trendIcon: "horizontal_rule",
    trend: "Estable",
    trendClass: "text-[#d0c6ab]",
  },
  {
    title: "Margen Neto",
    value: "28.4%",
    icon: "pie_chart",
    trendIcon: "trending_up",
    trend: "+2.1% pts",
    trendClass: "text-[#4ADE80]",
  },
];

const servicios = [
  {
    id: "#SRV-8902",
    cliente: "Carlos Mendoza",
    bicicleta: "Trek Emonda SL 6",
    mecanico: "J. Alvarez",
    estado: "En Proceso",
    estadoClass: "border-[#ffd700] text-[#ffd700]",
  },
  {
    id: "#SRV-8901",
    cliente: "Laura Torres",
    bicicleta: "Specialized Vado",
    mecanico: "M. Silva",
    estado: "Pendiente Piezas",
    estadoClass: "border-[#ffb4ab] text-[#ffb4ab]",
  },
  {
    id: "#SRV-8899",
    cliente: "Andrés Felipe Roa",
    bicicleta: "Santa Cruz Hightower",
    mecanico: "J. Alvarez",
    estado: "Listo para Entrega",
    estadoClass: "border-[#4ADE80] text-[#4ADE80]",
  },
  {
    id: "#SRV-8898",
    cliente: "Diana Martínez",
    bicicleta: "Cannondale Synapse",
    mecanico: "P. Gomez",
    estado: "En Proceso",
    estadoClass: "border-[#ffd700] text-[#ffd700]",
  },
];

const alertas = [
  {
    producto: "Cadena Shimano Ultegra 11v",
    estado: "0 Stock",
    detalle: "Requerida para 2 órdenes de taller pendientes.",
    accion: "Reabastecer",
    color: "bg-[#ffb4ab]",
    estadoClass: "text-[#ffb4ab]",
  },
  {
    producto: "Continental GP5000 S TR",
    estado: "Stock Bajo (2)",
    detalle: "Alta demanda proyectada para esta semana.",
    accion: "Revisar",
    color: "bg-[#ffd700]",
    estadoClass: "text-[#ffd700]",
  },
];

function Dashboard() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    setUsuario(obtenerSesion());
  }, []);

  const rolId = Number(usuario?.rol);
  const primaryModule = rolId === 1 ? "/venta" : rolId === 2 ? "/reportes" : "/dashboard";

  if (!usuario) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-xl text-white">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="flex flex-col justify-between gap-6 rounded border border-[#1a1a1a] bg-[#0a0a0a] p-6 md:flex-row md:items-end">
        <div>
          <h2 className="mb-2 font-mono text-base font-bold uppercase text-[#ffd700]">
            Bienvenido, {usuario.nombre}
          </h2>
          <p className="text-[#e3e2e2]">
            {getRoleName(rolId)} activo. Gestiona tu ecosistema con precisión quirúrgica.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="rounded border border-[#333333] bg-[#121212] px-4 py-2 text-center">
            <p className="mb-1 font-mono text-xs uppercase text-[#d0c6ab]">
              Estado Taller
            </p>
            <p className="flex items-center justify-center gap-1 font-mono text-sm font-bold text-[#4ADE80]">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Operativo
            </p>
          </div>
          <div className="rounded border border-[#333333] bg-[#121212] px-4 py-2 text-center">
            <p className="mb-1 font-mono text-xs uppercase text-[#d0c6ab]">
              Última Sincronización
            </p>
            <p className="font-mono text-sm font-bold text-[#e3e2e2]">Hace 2 min</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.title}
            className="group relative overflow-hidden rounded border border-[#1a1a1a] bg-[#0a0a0a] p-5 transition-colors hover:border-[#ffd700]"
          >
            <div className="mb-4 flex items-start justify-between">
              <h3 className="font-mono text-sm uppercase tracking-widest text-[#d0c6ab]">
                {kpi.title}
              </h3>
              <span className="material-symbols-outlined text-[#ffd700]/50 transition-opacity group-hover:text-[#ffd700]">
                {kpi.icon}
              </span>
            </div>
            <p className="mb-2 text-2xl font-bold text-[#e3e2e2]">{kpi.value}</p>
            <div className={`flex items-center gap-2 font-mono text-sm ${kpi.trendClass}`}>
              <span className="material-symbols-outlined text-sm">{kpi.trendIcon}</span>
              <span>{kpi.trend}</span>
            </div>
            {kpi.chart === "line" && (
              <div className="absolute bottom-0 left-0 h-8 w-full opacity-20">
                <svg
                  className="h-full w-full fill-none stroke-[#ffd700]"
                  preserveAspectRatio="none"
                  strokeWidth="1"
                  viewBox="0 0 100 20"
                >
                  <path d="M0,20 L10,15 L20,18 L30,10 L40,12 L50,5 L60,8 L70,2 L80,6 L90,1 L100,5" />
                </svg>
              </div>
            )}
            {kpi.chart === "bars" && (
              <div className="absolute bottom-0 left-0 flex h-8 w-full items-end gap-1 px-2 opacity-20">
                {[40, 60, 30, 80, 50].map((height) => (
                  <div
                    key={height}
                    className="w-full bg-[#ffd700]"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className="flex flex-col rounded border border-[#1a1a1a] bg-[#0a0a0a] lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#1a1a1a] p-5">
            <h3 className="text-lg font-bold text-[#e3e2e2]">
              Actividad Reciente del Taller
            </h3>
            <Link
              to={primaryModule}
              className="font-mono text-xs uppercase text-[#ffd700] hover:underline"
            >
              Ver Todo
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#333333] bg-[#121212]">
                  {["ID Servicio", "Cliente", "Bicicleta", "Mecánico", "Estado"].map((heading) => (
                    <th
                      key={heading}
                      className={`p-4 font-mono text-sm font-normal uppercase text-[#d0c6ab] ${
                        heading === "Estado" ? "text-right" : ""
                      }`}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a] font-mono text-sm text-[#e3e2e2]">
                {servicios.map((servicio) => (
                  <tr key={servicio.id} className="transition-colors hover:bg-[#121212]">
                    <td className="p-4">{servicio.id}</td>
                    <td className="p-4">{servicio.cliente}</td>
                    <td className="p-4 text-[#d0c6ab]">{servicio.bicicleta}</td>
                    <td className="p-4">{servicio.mecanico}</td>
                    <td className="p-4 text-right">
                      <span className={`inline-block rounded border bg-[#121212] px-2 py-1 text-[10px] uppercase ${servicio.estadoClass}`}>
                        {servicio.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex flex-col gap-4">
          {rolId === 1 ? (
            <section className="flex-1 rounded border border-[#ffb4ab]/50 bg-[#0a0a0a]">
              <div className="flex items-center gap-2 border-b border-[#1a1a1a] p-5">
                <span className="material-symbols-outlined text-[#ffb4ab]">warning</span>
                <h3 className="text-lg font-bold uppercase tracking-widest text-[#ffb4ab]">
                  Alertas Críticas
                </h3>
              </div>
              <div className="space-y-4 p-5">
                {alertas.map((alerta) => (
                  <div
                    key={alerta.producto}
                    className="relative rounded border border-[#333333] bg-[#121212] p-4"
                  >
                    <div className={`absolute left-0 top-0 h-full w-1 rounded-l ${alerta.color}`} />
                    <div className="mb-1 flex items-start justify-between gap-3">
                      <h4 className="font-mono text-sm text-[#e3e2e2]">{alerta.producto}</h4>
                      <span className={`font-mono text-xs font-bold uppercase ${alerta.estadoClass}`}>
                        {alerta.estado}
                      </span>
                    </div>
                    <p className="mb-2 font-mono text-sm text-[#d0c6ab]">{alerta.detalle}</p>
                    <Link
                      to="/inventario"
                      className="text-xs uppercase text-[#ffd700] hover:underline"
                    >
                      {alerta.accion}
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="flex-1 rounded border border-[#1a1a1a] bg-[#0a0a0a] p-5">
              <h3 className="font-mono text-sm uppercase tracking-widest text-[#d0c6ab]">
                Accesos administrativos
              </h3>
              <p className="mt-3 text-sm text-[#e3e2e2]">
                Tu rol se centra en empleados y reportes. Usa el menú lateral para abrir esas funciones.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <Link
                  to="/empleados"
                  className="flex items-center gap-3 rounded-lg border border-[#333333] bg-[#121212] px-4 py-3 text-sm text-[#e3e2e2] transition-colors hover:border-[#ffd700] hover:text-[#ffd700]"
                >
                  <span className="material-symbols-outlined text-sm">badge</span>
                  <span>Empleados</span>
                </Link>
                <Link
                  to="/reportes"
                  className="flex items-center gap-3 rounded-lg border border-[#333333] bg-[#121212] px-4 py-3 text-sm text-[#e3e2e2] transition-colors hover:border-[#ffd700] hover:text-[#ffd700]"
                >
                  <span className="material-symbols-outlined text-sm">analytics</span>
                  <span>Reportes</span>
                </Link>
              </div>
            </section>
          )}

          <section className="rounded border border-[#1a1a1a] bg-[#0a0a0a] p-5">
            <h3 className="mb-4 font-mono text-sm uppercase tracking-widest text-[#d0c6ab]">
              Telemetría de Negocio
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border-t border-[#333333] pt-2">
                <p className="mb-1 font-mono text-sm text-[#d0c6ab]">Rotación Inventario</p>
                <div className="flex items-end gap-2">
                  <p className="text-xl font-bold text-[#e3e2e2]">14.2%</p>
                  <span className="material-symbols-outlined mb-1 text-sm text-[#4ADE80]">
                    arrow_upward
                  </span>
                </div>
              </div>
              <div className="border-t border-[#333333] pt-2">
                <p className="mb-1 font-mono text-sm text-[#d0c6ab]">Eficiencia Taller</p>
                <div className="flex items-end gap-2">
                  <p className="text-xl font-bold text-[#e3e2e2]">94.2%</p>
                  <span className="material-symbols-outlined mb-1 text-sm text-[#ffd700]">
                    bolt
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
