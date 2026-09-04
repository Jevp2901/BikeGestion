import { useEffect, useMemo, useState } from "react";
import { API_V1_BASE_URL, obtenerSesion } from "../utils/sesion";
import "../App.css";

const today = new Date().toISOString().slice(0, 10);
const money = (value) => `$${Number(value || 0).toLocaleString("es-CO")} COP`;

function ComprasFlujo() {
  const [suppliers, setSuppliers] = useState([]);
  const [supplier, setSupplier] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [lines, setLines] = useState([]);
  const [form, setForm] = useState({ fecha_compra: today, metodo_pago: "Efectivo" });
  const [selectedArticle, setSelectedArticle] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState("");
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const [supplierResponse, purchaseResponse] = await Promise.all([fetch(`${API_V1_BASE_URL}/proveedores/`), fetch(`${API_V1_BASE_URL}/compras/`)]);
      const [supplierData, purchaseData] = await Promise.all([supplierResponse.json(), purchaseResponse.json()]);
      if (!supplierResponse.ok || !purchaseResponse.ok) throw new Error("No fue posible cargar proveedores y compras.");
      setSuppliers((Array.isArray(supplierData) ? supplierData : []).filter((item) => item.estado === "Activo"));
      setPurchases(Array.isArray(purchaseData) ? purchaseData : []);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  useEffect(() => { void Promise.resolve().then(load); }, []);

  const selectSupplier = async (event) => {
    const item = suppliers.find((entry) => String(entry.nit_proveedor) === event.target.value);
    if (!item) { setSupplier(null); setLines([]); return; }
    try {
      const response = await fetch(`${API_V1_BASE_URL}/proveedores/${item.nit_proveedor}/`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No fue posible cargar el catálogo del proveedor.");
      setSupplier({ ...item, ...data }); setLines([]); setSelectedArticle("");
    } catch (err) { setError(err.message); }
  };

  const articles = supplier?.articulos || [];
  useEffect(() => {
    const article = (supplier?.articulos || []).find((item) => String(item.id_articulo) === String(selectedArticle));
    void Promise.resolve().then(() => setUnitPrice(article?.precio_compra || ""));
  }, [selectedArticle, supplier]);
  const addLine = () => {
    const article = articles.find((item) => String(item.id_articulo) === String(selectedArticle));
    const amount = Number(quantity); const price = Number(unitPrice || article?.precio_compra || 0);
    if (!article) return setError("Selecciona un artículo asociado al proveedor.");
    if (!Number.isInteger(amount) || amount <= 0) return setError("La cantidad debe ser un entero mayor que cero.");
    if (!Number.isFinite(price) || price <= 0) return setError("Indica un precio de compra mayor que cero.");
    setLines((current) => { const existing = current.find((line) => line.id_articulo === article.id_articulo); return existing ? current.map((line) => line.id_articulo === article.id_articulo ? { ...line, cantidad_articulo: line.cantidad_articulo + amount, valor_unitario: price } : line) : [...current, { ...article, cantidad_articulo: amount, valor_unitario: price }]; });
    setSelectedArticle(""); setQuantity(1); setUnitPrice(""); setError("");
  };
  const total = useMemo(() => lines.reduce((sum, line) => sum + Number(line.cantidad_articulo) * Number(line.valor_unitario), 0), [lines]);
  const submit = async (event) => {
    event.preventDefault(); setError(""); setNotice("");
    if (!supplier) return setError("Selecciona un proveedor activo.");
    if (!lines.length) return setError("Agrega al menos un artículo a la compra.");
    const session = obtenerSesion(); setSaving(true);
    try {
      const response = await fetch(`${API_V1_BASE_URL}/compras/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id_usuario: session?.id, nit_proveedor: supplier.nit_proveedor, fecha_compra: form.fecha_compra, metodo_pago: form.metodo_pago, detalles: lines.map((line) => ({ id_articulo: line.id_articulo, cantidad_articulo: line.cantidad_articulo, valor_unitario: line.valor_unitario, descuento_compra: 0 })) }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || Object.values(data).flat().join(" ") || "La compra fue rechazada.");
      setNotice(`Compra #${data.id_compra} registrada. El stock, pago y recibo fueron actualizados automáticamente.`); setLines([]); setSupplier(null); setForm({ fecha_compra: today, metodo_pago: "Efectivo" }); await load();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  };

  return <section className="mx-auto max-w-7xl space-y-6"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-xs font-black uppercase tracking-[0.35em] text-[#ffd700]">Operación real · RF15 / RF16</p><h1 className="mt-2 text-4xl font-black uppercase italic tracking-tight text-[#e3e2e2]">Compras</h1><p className="mt-2 text-sm text-[#d0c6ab]">Registra compras válidas y actualiza el inventario automáticamente.</p></div><button onClick={load} className="rounded-lg border border-[#393522] px-4 py-3 text-xs font-black uppercase text-[#ffd700]">Actualizar</button></div>{notice && <div className="rounded-lg border border-green-800 bg-green-950/40 p-3 text-sm text-green-300">{notice}</div>}{error && <div className="rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-300">{error}</div>}<div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]"><form onSubmit={submit} className="space-y-5 rounded-2xl border border-[#3f371a] bg-[#11110e] p-5"><div className="flex items-center justify-between border-b border-[#302d20] pb-4"><div><p className="text-[10px] font-black uppercase tracking-wider text-[#ffd700]">Registrar nueva compra</p><p className="mt-1 text-[11px] text-[#8e896f]">Solo proveedores activos y artículos asociados.</p></div><span className="rounded bg-[#3b350f] px-2 py-1 text-[9px] font-bold text-[#ffe55c]">Entrada automática</span></div><label className="block text-xs font-bold uppercase tracking-wider text-[#d0c6ab]">Proveedor activo<select required value={supplier?.nit_proveedor || ""} onChange={selectSupplier} className="ui-field mt-2 w-full rounded-lg border border-[#393522] bg-[#0d0c08] p-3 text-sm text-white"><option value="">Seleccionar proveedor...</option>{suppliers.map((item) => <option key={item.nit_proveedor} value={item.nit_proveedor}>{item.nombre_proveedor} · NIT {item.nit_proveedor}</option>)}</select></label>{supplier && <div className="rounded-lg border border-[#31563f] bg-[#102519] p-3 text-[11px] text-[#9be8b8]"><strong>{supplier.nombre_proveedor}</strong><span className="ml-2">{articles.length} artículos asociados · Activo</span></div>}<div className="grid gap-3 sm:grid-cols-[1fr_100px_140px_auto] sm:items-end"><label className="block text-xs font-bold uppercase tracking-wider text-[#d0c6ab]">Artículo<select value={selectedArticle} onChange={(event) => setSelectedArticle(event.target.value)} disabled={!supplier} className="ui-field mt-2 w-full rounded-lg border border-[#393522] bg-[#0d0c08] p-3 text-sm text-white"><option value="">Seleccionar...</option>{articles.map((item) => <option key={item.id_articulo} value={item.id_articulo}>{item.nombre_articulo}</option>)}</select></label><label className="block text-xs font-bold uppercase tracking-wider text-[#d0c6ab]">Cantidad<input min="1" type="number" value={quantity} onChange={(event) => setQuantity(event.target.value)} className="ui-field mt-2 w-full rounded-lg border border-[#393522] bg-[#0d0c08] p-3 text-sm text-white" /></label><label className="block text-xs font-bold uppercase tracking-wider text-[#d0c6ab]">Precio compra<input min="0" type="number" value={unitPrice} onChange={(event) => setUnitPrice(event.target.value)} placeholder="Costo unitario" className="ui-field mt-2 w-full rounded-lg border border-[#393522] bg-[#0d0c08] p-3 text-sm text-white" /></label><button type="button" onClick={addLine} disabled={!supplier} className="rounded-lg bg-[#ffd700] px-4 py-3 text-xs font-black uppercase text-black disabled:opacity-40">Agregar</button></div><div className="overflow-x-auto rounded-lg border border-[#302d20]"><table className="w-full min-w-[600px] text-left text-xs"><thead className="bg-[#19170f] text-[9px] uppercase tracking-wider text-[#8e896f]"><tr><th className="p-3">Artículo</th><th className="p-3 text-right">Cantidad</th><th className="p-3 text-right">Unitario</th><th className="p-3 text-right">Subtotal</th><th /></tr></thead><tbody className="divide-y divide-[#302d20]">{lines.map((line) => <tr key={line.id_articulo}><td className="p-3 text-[#eeeade]">{line.nombre_articulo}</td><td className="p-3 text-right text-[#d0c6ab]">{line.cantidad_articulo}</td><td className="p-3 text-right text-[#d0c6ab]">{money(line.valor_unitario)}</td><td className="p-3 text-right font-bold text-[#eeeade]">{money(line.cantidad_articulo * line.valor_unitario)}</td><td className="p-3 text-right"><button type="button" onClick={() => setLines((current) => current.filter((item) => item.id_articulo !== line.id_articulo))} className="text-[#ff8f84]">Quitar</button></td></tr>)}{!lines.length && <tr><td colSpan="5" className="p-8 text-center text-[#77705a]">Agrega artículos del proveedor seleccionado.</td></tr>}</tbody></table></div><div className="grid gap-3 sm:grid-cols-2"><label className="block text-xs font-bold uppercase tracking-wider text-[#d0c6ab]">Fecha de compra<input required type="date" value={form.fecha_compra} onChange={(event) => setForm({ ...form, fecha_compra: event.target.value })} className="ui-field mt-2 w-full rounded-lg border border-[#393522] bg-[#0d0c08] p-3 text-sm text-white" /></label><label className="block text-xs font-bold uppercase tracking-wider text-[#d0c6ab]">Método de pago<select value={form.metodo_pago} onChange={(event) => setForm({ ...form, metodo_pago: event.target.value })} className="ui-field mt-2 w-full rounded-lg border border-[#393522] bg-[#0d0c08] p-3 text-sm text-white"><option>Efectivo</option><option>Tarjeta credito</option><option>Debito</option></select></label></div><div className="flex items-center justify-between border-t border-[#302d20] pt-4"><span className="text-xs font-black uppercase text-[#d0c6ab]">Total de compra</span><strong className="text-2xl font-black text-[#ffd700]">{money(total)}</strong></div><button disabled={saving || !lines.length} className="w-full rounded-lg bg-[#ffd700] px-5 py-4 text-xs font-black uppercase text-black disabled:cursor-not-allowed disabled:opacity-40">{saving ? "Registrando..." : "Confirmar y registrar compra"}</button></form><aside className="space-y-5"><div className="rounded-2xl border border-[#222424] bg-[#101111] p-5"><p className="text-[10px] font-black uppercase tracking-wider text-[#ffd700]">Resumen del flujo</p><div className="mt-4 space-y-3 text-xs text-[#aaa79d]"><p>Proveedor: <strong className="float-right text-[#eeeade]">{supplier?.nombre_proveedor || "Pendiente"}</strong></p><p>Artículos: <strong className="float-right text-[#eeeade]">{lines.length}</strong></p><p>Unidades: <strong className="float-right text-[#eeeade]">{lines.reduce((sum, line) => sum + Number(line.cantidad_articulo), 0)}</strong></p><p className="border-t border-[#292b2b] pt-3">Entrada a inventario: <strong className="float-right text-[#42e6a4]">Automática</strong></p></div></div><div className="rounded-2xl border border-[#222424] bg-[#101111] p-5"><div className="flex items-center justify-between"><p className="text-[10px] font-black uppercase tracking-wider text-[#ffd700]">Historial de compras</p><span className="text-[10px] text-[#77705a]">{purchases.length} registros</span></div><div className="mt-4 max-h-[360px] space-y-2 overflow-y-auto">{loading ? <p className="p-6 text-center text-xs text-[#aaa79d]">Cargando...</p> : purchases.map((item) => <button type="button" key={item.id_compra} onClick={() => setDetail(item)} className="w-full rounded-lg border border-[#292b2b] bg-[#0d0e0f] p-3 text-left hover:border-[#ffd700]/50"><div className="flex justify-between"><strong className="text-xs text-[#eeeade]">Compra #{item.id_compra}</strong><span className="text-[9px] text-[#42e6a4]">{item.estado_compra}</span></div><p className="mt-1 text-[10px] text-[#aaa79d]">{item.nombre_proveedor} · {item.fecha_compra}</p><p className="mt-1 text-right font-mono text-xs text-[#ffd700]">{money(item.detalles?.reduce((sum, line) => sum + Number(line.total_compra || 0), 0))}</p></button>)}</div></div></aside></div>{detail && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#4d4732] bg-[#0d0e0f] p-5"><div className="flex justify-between"><div><p className="text-[10px] font-black uppercase text-[#ffd700]">Detalle de compra #{detail.id_compra}</p><p className="mt-1 text-xs text-[#aaa79d]">{detail.nombre_proveedor} · {detail.fecha_compra}</p></div><button onClick={() => setDetail(null)} className="text-[#aaa79d]">Cerrar</button></div><div className="mt-5 overflow-x-auto"><table className="w-full text-left text-xs"><thead className="border-b border-[#302d20] text-[#ffd700]"><tr><th className="p-3">Artículo</th><th className="p-3 text-right">Cantidad</th><th className="p-3 text-right">Total</th></tr></thead><tbody>{(detail.detalles || []).map((line) => <tr key={line.id_articulo} className="border-b border-[#222424]"><td className="p-3 text-[#eeeade]">{line.nombre_articulo}</td><td className="p-3 text-right text-[#d0c6ab]">{line.cantidad_articulo}</td><td className="p-3 text-right text-[#ffd700]">{money(line.total_compra)}</td></tr>)}</tbody></table></div><div className="mt-5 flex justify-between border-t border-[#302d20] pt-4 text-sm"><span className="text-[#aaa79d]">Estado: {detail.estado_compra}</span><strong className="text-[#ffd700]">{money(detail.detalles?.reduce((sum, line) => sum + Number(line.total_compra || 0), 0))}</strong></div></div></div>}</section>;
}

export default ComprasFlujo;
