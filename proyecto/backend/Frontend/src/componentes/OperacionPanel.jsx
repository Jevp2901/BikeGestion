import { useEffect, useState } from "react";
import { API_V1_BASE_URL, obtenerSesion } from "../utils/sesion";

const CONFIG = {
  cotizaciones: { title: "Cotizaciones", endpoint: "cotizaciones", icon: "request_quote" },
  compras: { title: "Compras", endpoint: "compras", icon: "local_shipping" },
  ventas: { title: "Ventas", endpoint: "ventas", icon: "point_of_sale" },
  proveedores: { title: "Proveedores", endpoint: "proveedores", icon: "handshake" },
  empleados: { title: "Empleados", endpoint: "empleados", icon: "badge" },
  reportes: { title: "Reportes", endpoint: "reportes/datos/?tipo=inventario", icon: "analytics" },
  mantenimiento: { title: "Mantenimiento y Reparación", endpoint: "usuarios/mantenimiento", icon: "build" },
};

const today = new Date().toISOString().slice(0, 10);

function OperacionPanel({ tipo }) {
  const config = CONFIG[tipo];
  const [records, setRecords] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reportType, setReportType] = useState("inventario");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({});

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const url = tipo === "reportes"
        ? `${API_V1_BASE_URL}/reportes/datos/?tipo=${reportType}`
        : `${API_V1_BASE_URL}/${config.endpoint}/`;
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No fue posible cargar la información.");
      if (tipo === "reportes") setReportData(data.datos || []);
      else setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [tipo, reportType]);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    const session = obtenerSesion();
    let payload = { ...form };
    if (["cotizaciones", "compras", "ventas"].includes(tipo)) payload.id_usuario = session?.id;
    if (tipo === "cotizaciones") {
      payload.fecha_cotizacion = payload.fecha_cotizacion || today;
      payload.detalles = [{ id_articulo: Number(payload.id_articulo), cantidad_articulo: Number(payload.cantidad_articulo), valor_unitario: Number(payload.valor_unitario), descuento_cotizacion: 0 }];
    }
    if (tipo === "compras") {
      payload.fecha_compra = payload.fecha_compra || today;
      payload.detalles = [{ id_articulo: Number(payload.id_articulo), cantidad_articulo: Number(payload.cantidad_articulo), valor_unitario: Number(payload.valor_unitario), descuento_compra: 0 }];
    }
    try {
      const response = await fetch(`${API_V1_BASE_URL}/${config.endpoint}/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || Object.values(data).flat().join(" ") || "No fue posible guardar.");
      setNotice("Registro guardado correctamente.");
      setShowForm(false);
      setForm({});
      load();
    } catch (err) { setError(err.message); }
  };

  const action = async (url, body) => {
    const response = await fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "No fue posible actualizar el registro.");
    setNotice("Estado actualizado correctamente.");
    load();
  };

  const convertirEnVenta = async (cotizacion) => {
    const session = obtenerSesion();
    try {
      const response = await fetch(`${API_V1_BASE_URL}/ventas/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: session?.id,
          id_cotizacion: cotizacion.id_cotizacion,
          fecha_venta: today,
          metodo_pago: "Efectivo",
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No fue posible generar la venta.");
      setNotice("La cotización fue convertida en venta y se generó su recibo.");
      load();
    } catch (err) { setError(err.message); }
  };

  const renderForm = () => {
    if (!showForm) return null;
    const fields = tipo === "proveedores"
      ? [["nit_proveedor", "NIT"], ["nombre_proveedor", "Nombre"], ["correo", "Correo"], ["telefono", "Teléfono"], ["direccion", "Dirección"]]
      : tipo === "cotizaciones"
        ? [["id_cliente", "ID cliente"], ["fecha_cotizacion", "Fecha"], ["id_articulo", "ID artículo"], ["cantidad_articulo", "Cantidad"], ["valor_unitario", "Valor unitario"]]
        : tipo === "compras"
          ? [["nit_proveedor", "NIT proveedor"], ["fecha_compra", "Fecha"], ["id_articulo", "ID artículo"], ["cantidad_articulo", "Cantidad"], ["valor_unitario", "Valor unitario"]]
      : [];
    return <form onSubmit={submit} className="mb-6 grid gap-3 rounded-2xl border border-[#4d4732] bg-[#0d0e0f] p-5 md:grid-cols-2">
      {fields.map(([name, label]) => <label key={name} className="text-xs font-bold uppercase tracking-widest text-[#d0c6ab]">{label}<input required={!["correo", "telefono", "direccion", "id_cliente"].includes(name)} name={name} value={form[name] || ""} onChange={update} type={name.includes("fecha") ? "date" : name.includes("id_") || name.includes("nit") || name.includes("cantidad") || name.includes("valor") ? "number" : "text"} className="mt-2 w-full rounded-lg border border-[#333] bg-[#080808] p-3 text-sm text-white outline-none focus:border-[#ffd700]" /></label>)}
      {tipo === "compras" && <label className="text-xs font-bold uppercase tracking-widest text-[#d0c6ab]">Medio de pago<select required name="metodo_pago" value={form.metodo_pago || ""} onChange={update} className="mt-2 w-full rounded-lg border border-[#333] bg-[#080808] p-3 text-sm text-white"><option value="">Seleccionar</option><option>Tarjeta credito</option><option>Debito</option><option>Efectivo</option></select></label>}
      <div className="flex items-end gap-3"><button className="rounded-lg bg-[#ffd700] px-5 py-3 text-xs font-black uppercase tracking-widest text-black">Guardar</button><button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-[#333] px-5 py-3 text-xs font-black uppercase tracking-widest text-[#d0c6ab]">Cancelar</button></div>
    </form>;
  };

  return <section className="mx-auto max-w-7xl space-y-6">
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-xs font-black uppercase tracking-[0.35em] text-[#ffd700]">Operación real</p><h1 className="mt-2 text-4xl font-black uppercase italic tracking-tight text-[#e3e2e2]">{config.title}</h1><p className="mt-2 text-sm text-[#d0c6ab]">Información conectada directamente con la base de datos de BikeGestión.</p></div>{tipo !== "reportes" && tipo !== "ventas" && tipo !== "empleados" && <button onClick={() => setShowForm((value) => !value)} className="rounded-lg bg-[#ffd700] px-5 py-3 text-xs font-black uppercase tracking-widest text-black">{showForm ? "Cerrar formulario" : "Nuevo registro"}</button>}</div>
    {tipo === "reportes" && <div className="flex gap-2"><select value={reportType} onChange={(event) => setReportType(event.target.value)} className="rounded-lg border border-[#333] bg-[#0d0e0f] p-3 text-sm text-white"><option value="inventario">Stock bajo</option><option value="ventas">Ventas</option><option value="compras">Compras</option><option value="mantenimiento">Mantenimiento</option><option value="empleados">Empleados</option></select></div>}
    {notice && <div className="rounded-lg border border-green-800 bg-green-950/40 p-3 text-sm text-green-300">{notice}</div>}{error && <div className="rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-300">{error}</div>}
    {renderForm()}
    <div className="overflow-hidden rounded-2xl border border-[#1f1f1f] bg-[#0a0a0a]"><div className="flex items-center justify-between border-b border-[#1f1f1f] bg-[#121212] p-4"><span className="material-symbols-outlined text-[#ffd700]">{config.icon}</span><button onClick={load} className="text-xs font-bold uppercase tracking-widest text-[#d0c6ab] hover:text-[#ffd700]">Actualizar</button></div>{loading ? <div className="p-10 text-center text-sm text-[#d0c6ab]">Cargando datos...</div> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-[#1f1f1f] text-xs uppercase tracking-widest text-[#ffd700]"><th className="p-4">Identificador</th><th className="p-4">Resumen</th><th className="p-4">Estado</th><th className="p-4" /></tr></thead><tbody className="divide-y divide-[#1f1f1f]">{(tipo === "reportes" ? reportData : records).map((item, index) => <tr key={item.id_cotizacion || item.id_compra || item.id_venta || item.nit_proveedor || item.id_empleado || index} className="hover:bg-[#121212]"><td className="p-4 font-mono text-[#d0c6ab]">{item.id_cotizacion || item.id_compra || item.id_venta || item.nit_proveedor || item.id_empleado || "Vista"}</td><td className="p-4 text-[#e3e2e2]">{item.nombre_proveedor || item.nombre_cliente || item.nombre_usuario || item.nombre_articulo || item.tipo_reporte || item.fecha_compra || item.fecha_venta || "Registro operativo"}</td><td className="p-4"><span className="rounded-full bg-[#ffd700]/10 px-3 py-1 text-xs text-[#ffd700]">{item.estado_cotizacion || item.estado_compra || item.estado_venta || item.estado || item.estado_activo || "Disponible"}</span></td><td className="p-4 text-right">{tipo === "cotizaciones" && item.estado_cotizacion === "Borrador" && <button onClick={() => action(`${API_V1_BASE_URL}/cotizaciones/${item.id_cotizacion}/`, { estado_cotizacion: "Aceptada" })} className="mr-3 text-xs font-bold uppercase text-[#ffd700]">Aceptar</button>}{tipo === "cotizaciones" && item.estado_cotizacion === "Aceptada" && <button onClick={() => convertirEnVenta(item)} className="text-xs font-bold uppercase text-green-400">Generar venta</button>}{tipo === "ventas" && item.estado_venta === "Realizada" && <button onClick={() => action(`${API_V1_BASE_URL}/ventas/${item.id_venta}/`, { estado_venta: "Devuelta" })} className="text-xs font-bold uppercase text-[#ffb4ab]">Devolver</button>}</td></tr>)}{(tipo === "reportes" ? reportData : records).length === 0 && <tr><td colSpan="4" className="p-10 text-center text-[#d0c6ab]">No hay registros para mostrar.</td></tr>}</tbody></table></div>}</div>
  </section>;
}

export default OperacionPanel;
