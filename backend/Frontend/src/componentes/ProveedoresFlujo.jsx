import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_V1_BASE_URL } from "../utils/sesion";
import "../App.css";

const emptyForm = { nit_proveedor: "", nombre_proveedor: "", correo: "", telefono: "", direccion: "" };
const money = (value) => `$${Number(value || 0).toLocaleString("es-CO")} COP`;

function ProveedoresFlujo() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const [supplierResponse, purchaseResponse] = await Promise.all([fetch(`${API_V1_BASE_URL}/proveedores/`), fetch(`${API_V1_BASE_URL}/compras/`)]);
      const supplierData = await supplierResponse.json(); const purchaseData = await purchaseResponse.json();
      if (!supplierResponse.ok || !purchaseResponse.ok) throw new Error("No fue posible cargar proveedores y compras.");
      setSuppliers(Array.isArray(supplierData) ? supplierData : []); setPurchases(Array.isArray(purchaseData) ? purchaseData : []);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  useEffect(() => { void Promise.resolve().then(load); }, []);

  const openSupplier = async (item) => {
    try {
      const response = await fetch(`${API_V1_BASE_URL}/proveedores/${item.nit_proveedor}/`); const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No fue posible cargar la ficha del proveedor.");
      setSelected({ ...item, ...data });
    } catch (err) { setError(err.message); }
  };

  const save = async (event) => {
    event.preventDefault(); setError(""); setNotice("");
    if (!/^\d{5,15}$/.test(form.nit_proveedor.trim())) return setError("El NIT debe contener entre 5 y 15 dígitos.");
    if (form.nombre_proveedor.trim().length < 3) return setError("La razón social debe tener al menos 3 caracteres.");
    try {
      const response = await fetch(`${API_V1_BASE_URL}/proveedores/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, nit_proveedor: form.nit_proveedor.trim(), nombre_proveedor: form.nombre_proveedor.trim() }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || Object.values(data).flat().join(" "));
      setNotice("Proveedor registrado. Ahora puedes asociarlo a sus artículos y crear una compra."); setForm(emptyForm); setShowForm(false); await load();
    } catch (err) { setError(err.message); }
  };

  const toggleStatus = async () => {
    if (!selected) return;
    const estado = selected.estado === "Activo" ? "Inactivo" : "Activo";
    try {
      const response = await fetch(`${API_V1_BASE_URL}/proveedores/${selected.nit_proveedor}/`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ estado }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "No fue posible actualizar el estado.");
      setSelected(data); setNotice(`Proveedor ${estado.toLowerCase()} correctamente.`); await load();
    } catch (err) { setError(err.message); }
  };

  const visible = suppliers.filter((item) => (filter === "todos" || item.estado === filter) && `${item.nombre_proveedor} ${item.nit_proveedor}`.toLowerCase().includes(search.toLowerCase()));
  const supplierPurchases = selected ? purchases.filter((item) => String(item.nit_proveedor) === String(selected.nit_proveedor)) : [];

  return <section className="mx-auto max-w-7xl space-y-6"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-xs font-black uppercase tracking-[0.35em] text-[#ffd700]">Terceros y abastecimiento · RF15</p><h1 className="mt-2 text-4xl font-black uppercase italic tracking-tight text-[#e3e2e2]">Proveedores</h1><p className="mt-2 text-sm text-[#d0c6ab]">Consulta proveedores, sus artículos asociados y el historial que sostiene la trazabilidad.</p></div><div className="flex gap-2"><button onClick={load} className="rounded-lg border border-[#393522] px-4 py-3 text-xs font-black uppercase text-[#ffd700]">Actualizar</button><button onClick={() => setShowForm((value) => !value)} className="rounded-lg bg-[#ffd700] px-4 py-3 text-xs font-black uppercase text-black">{showForm ? "Cerrar" : "Registrar proveedor"}</button></div></div>{notice && <div className="rounded-lg border border-green-800 bg-green-950/40 p-3 text-sm text-green-300">{notice}</div>}{error && <div className="rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-300">{error}</div>}{showForm && <form onSubmit={save} className="grid gap-3 rounded-2xl border border-[#4d4732] bg-[#11110e] p-5 md:grid-cols-2 lg:grid-cols-3">{[["nit_proveedor", "NIT"], ["nombre_proveedor", "Razón social"], ["correo", "Correo"], ["telefono", "Teléfono"], ["direccion", "Dirección"]].map(([name, label]) => <label key={name} className="text-xs font-bold uppercase tracking-wider text-[#d0c6ab]">{label}<input required={name === "nit_proveedor" || name === "nombre_proveedor"} value={form[name]} onChange={(event) => setForm({ ...form, [name]: event.target.value })} className="mt-2 w-full rounded-lg border border-[#393522] bg-[#0d0c08] p-3 text-sm text-white" /></label>)}<button className="self-end rounded-lg bg-[#ffd700] px-5 py-3 text-xs font-black uppercase text-black">Guardar proveedor</button></form>}<div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]"><div className="overflow-hidden rounded-2xl border border-[#222424] bg-[#0a0a0a]"><div className="flex flex-col gap-3 border-b border-[#222424] bg-[#121212] p-4 md:flex-row"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por NIT o nombre..." className="flex-1 rounded-lg border border-[#393522] bg-[#0d0c08] p-3 text-sm text-white" /><select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-lg border border-[#393522] bg-[#0d0c08] p-3 text-sm text-white"><option value="todos">Todos los estados</option><option value="Activo">Activos</option><option value="Inactivo">Inactivos</option></select></div>{loading ? <p className="p-10 text-center text-sm text-[#d0c6ab]">Cargando proveedores...</p> : <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-[#222424] text-[10px] uppercase tracking-wider text-[#ffd700]"><tr><th className="p-4">Proveedor</th><th className="p-4">Contacto</th><th className="p-4">Artículos</th><th className="p-4">Estado</th><th className="p-4" /></tr></thead><tbody className="divide-y divide-[#222424]">{visible.map((item) => <tr key={item.nit_proveedor} className="hover:bg-[#121212]"><td className="p-4"><strong className="block text-[#eeeade]">{item.nombre_proveedor}</strong><span className="font-mono text-[10px] text-[#aaa79d]">NIT {item.nit_proveedor}</span></td><td className="p-4 text-xs text-[#aaa79d]">{item.correo || item.telefono || "Sin contacto"}</td><td className="p-4 text-[#d0c6ab]">{item.articulos_asociados || 0}</td><td className="p-4"><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${item.estado === "Activo" ? "bg-green-950 text-green-300" : "bg-red-950 text-red-300"}`}>{item.estado}</span></td><td className="p-4 text-right"><button onClick={() => openSupplier(item)} className="text-xs font-black uppercase text-[#ffd700]">Ver ficha</button></td></tr>)}{!visible.length && <tr><td colSpan="5" className="p-10 text-center text-[#aaa79d]">No hay proveedores para este filtro.</td></tr>}</tbody></table></div>}</div><aside className="rounded-2xl border border-[#3f371a] bg-[#11110e] p-5">{selected ? <><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-black uppercase text-[#ffd700]">Ficha técnica del proveedor</p><h2 className="mt-2 text-xl font-black text-[#eeeade]">{selected.nombre_proveedor}</h2><p className="font-mono text-xs text-[#aaa79d]">NIT {selected.nit_proveedor}</p></div><button onClick={() => setSelected(null)} className="text-xs text-[#aaa79d]">Cerrar</button></div><div className="mt-4 grid grid-cols-2 gap-2 text-xs text-[#aaa79d]"><span>Estado<strong className="mt-1 block text-[#eeeade]">{selected.estado}</strong></span><span>Catálogo<strong className="mt-1 block text-[#eeeade]">{selected.articulos?.length || 0} artículos</strong></span></div><div className="mt-5"><p className="text-[10px] font-black uppercase text-[#ffd700]">Artículos asociados</p><div className="mt-2 space-y-2">{(selected.articulos || []).map((item) => <div key={item.id_articulo} className="rounded-lg border border-[#292b2b] p-3"><strong className="block text-xs text-[#eeeade]">{item.nombre_articulo}</strong><span className="text-[10px] text-[#aaa79d]">{item.tipo_articulo} · Último costo: {money(item.precio_compra)}</span></div>)}{!selected.articulos?.length && <p className="text-xs text-[#aaa79d]">No tiene artículos asociados.</p>}</div></div><div className="mt-5"><p className="text-[10px] font-black uppercase text-[#ffd700]">Compras vinculadas</p><p className="mt-2 text-xs text-[#aaa79d]">{supplierPurchases.length} compras registradas</p></div><div className="mt-5 flex gap-2"><button onClick={() => navigate("/compras")} className="flex-1 rounded-lg bg-[#ffd700] px-3 py-3 text-[10px] font-black uppercase text-black">Iniciar compra</button><button onClick={toggleStatus} className="rounded-lg border border-[#393522] px-3 py-3 text-[10px] font-black uppercase text-[#d0c6ab]">{selected.estado === "Activo" ? "Inactivar" : "Activar"}</button></div></> : <div className="flex min-h-[360px] items-center justify-center text-center text-sm text-[#aaa79d]">Selecciona un proveedor para consultar su ficha, catálogo e historial.</div>}</aside></div></section>;
}

export default ProveedoresFlujo;
