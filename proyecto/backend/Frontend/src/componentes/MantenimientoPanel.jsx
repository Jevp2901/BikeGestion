import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL, API_V1_BASE_URL, obtenerSesion } from "../utils/sesion";

const STATES = ["En proceso", "Reparado", "Devuelto"];
const STATE_META = {
  "En proceso": { label: "En proceso", tone: "text-[#ffd700]", dot: "bg-[#ffd700]", icon: "build" },
  Reparado: { label: "Reparado", tone: "text-[#42e6a4]", dot: "bg-[#42e6a4]", icon: "verified" },
  Devuelto: { label: "Devuelto", tone: "text-[#8fd7ff]", dot: "bg-[#8fd7ff]", icon: "assignment_return" },
};

const initialForm = { id_articulo: "", descripcion: "", fecha_inicio: new Date().toISOString().slice(0, 10) };
const initialTechnicalSheet = { falla_reportada: "", diagnostico_tecnico: "", inspeccion_recepcion: "", recomendaciones: "", prioridad: "Media" };

function dateLabel(value) {
  if (!value) return "Sin fecha";
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

function stateMeta(state) {
  return STATE_META[state] || STATE_META["En proceso"];
}

function MantenimientoPanel() {
  const session = obtenerSesion();
  const [records, setRecords] = useState([]);
  const [articles, setArticles] = useState([]);
  const [articleQuery, setArticleQuery] = useState("");
  const [articleCategory, setArticleCategory] = useState("Todas");
  const [articlePickerOpen, setArticlePickerOpen] = useState(false);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [checklist, setChecklist] = useState([]);
  const [parts, setParts] = useState([]);
  const [history, setHistory] = useState([]);
  const [delivery, setDelivery] = useState({ recibido_por: "", observaciones: "" });
  const [technicalSheet, setTechnicalSheet] = useState(initialTechnicalSheet);
  const [partForm, setPartForm] = useState({ id_articulo: "", cantidad: "1", observacion: "" });

  const authHeaders = () => ({ "X-User-ID": String(session?.id || "") });

  const loadArticles = async () => {
    setArticlesLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/articulos/`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No fue posible cargar el catálogo de artículos.");
      setArticles(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setArticlesLoading(false);
    }
  };

  const load = async (preserveSelection = true) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_V1_BASE_URL}/usuarios/mantenimiento/`, { headers: authHeaders() });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No fue posible cargar las órdenes del taller.");
      const nextRecords = Array.isArray(data) ? data : [];
      setRecords(nextRecords);
      if (!preserveSelection || !nextRecords.some((item) => item.id_mantenimiento === selectedId)) {
        setSelectedId(nextRecords[0]?.id_mantenimiento ?? null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(false); loadArticles(); }, []);

  const selected = records.find((item) => item.id_mantenimiento === selectedId) || null;
  const ownsSelected = Boolean(selected && Number(selected.id_usuario_mecanico) === Number(session?.id));
  const filteredRecords = useMemo(() => records.filter((item) => {
    const matchesFilter = filter === "Todos" || item.estado === filter;
    const haystack = `${item.id_mantenimiento} ${item.nombre_articulo || ""} ${item.descripcion || ""} ${item.nombre_usuario || ""}`.toLowerCase();
    return matchesFilter && haystack.includes(search.toLowerCase());
  }), [filter, records, search]);
  const counters = STATES.reduce((result, state) => ({ ...result, [state]: records.filter((item) => item.estado === state).length }), {});
  const categories = useMemo(() => ["Todas", ...new Set(articles.map((article) => article.tipo_articulo || "General").sort((a, b) => a.localeCompare(b)))], [articles]);
  const filteredArticles = useMemo(() => {
    const normalizedQuery = articleQuery.trim().toLowerCase();
    return articles.filter((article) => {
      const category = article.tipo_articulo || "General";
      const haystack = `${article.nombre_articulo} ${article.descripcion_articulo || ""} ${category}`.toLowerCase();
      return (articleCategory === "Todas" || category === articleCategory) && haystack.includes(normalizedQuery);
    }).slice(0, 30);
  }, [articleCategory, articleQuery, articles]);
  const selectedArticle = articles.find((article) => String(article.id_articulo) === String(form.id_articulo));

  useEffect(() => {
    if (selected) setNotes(selected.observaciones || selected.descripcion || "");
  }, [selectedId, selected]);

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    setChecklist([]);
    setParts([]);
    setHistory([]);
    setDelivery({ recibido_por: "", observaciones: "" });
    setTechnicalSheet(initialTechnicalSheet);
    setPartForm({ id_articulo: "", cantidad: "1", observacion: "" });
    const loadOperationalData = async () => {
      try {
        const base = `${API_V1_BASE_URL}/usuarios/mantenimiento/${selected.id_mantenimiento}`;
        const [checklistResponse, partsResponse, historyResponse, deliveryResponse, sheetResponse] = await Promise.all([
          fetch(`${base}/checklist/`, { headers: authHeaders() }),
          fetch(`${base}/repuestos/`, { headers: authHeaders() }),
          fetch(`${base}/historial/`, { headers: authHeaders() }),
          fetch(`${base}/entrega/`, { headers: authHeaders() }),
          fetch(`${base}/ficha/`, { headers: authHeaders() }),
        ]);
        const checklistData = await checklistResponse.json();
        const partsData = await partsResponse.json();
        const historyData = await historyResponse.json();
        const deliveryData = await deliveryResponse.json();
        const sheetData = await sheetResponse.json();
        if (cancelled) return;
        setChecklist(Array.isArray(checklistData) ? checklistData : []);
        setParts(Array.isArray(partsData) ? partsData : []);
        setHistory(Array.isArray(historyData) ? historyData : []);
        setDelivery({ recibido_por: deliveryData.recibido_por || "", observaciones: deliveryData.observaciones || "" });
        setTechnicalSheet({ ...initialTechnicalSheet, ...(sheetData || {}) });
      } catch {
        if (!cancelled) setError("No fue posible cargar la trazabilidad ampliada de la orden.");
      }
    };
    loadOperationalData();
    return () => { cancelled = true; };
  }, [selectedId]);

  const updateForm = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const selectArticle = (article) => {
    setForm((current) => ({ ...current, id_articulo: article.id_articulo }));
    setArticleQuery(article.nombre_articulo);
    setArticlePickerOpen(false);
  };

  const submitOrder = async (event) => {
    event.preventDefault();
    if (!form.id_articulo) {
      setError("Selecciona un artículo del inventario antes de registrar la orden.");
      setArticlePickerOpen(true);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`${API_V1_BASE_URL}/usuarios/mantenimiento/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          id_usuario_mecanico: session?.id,
          id_articulo: form.id_articulo ? Number(form.id_articulo) : null,
          descripcion: form.descripcion,
          fecha_inicio: form.fecha_inicio,
          estado: "En proceso",
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || Object.values(data).flat().join(" ") || "No fue posible registrar la orden.");
      setNotice("Orden registrada y añadida a la cola del taller.");
      setForm(initialForm);
      setShowForm(false);
      await load(false);
      setSelectedId(data.id_mantenimiento ?? null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const changeState = async (nextState) => {
    if (!selected) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`${API_V1_BASE_URL}/usuarios/mantenimiento/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          id_mantenimiento: selected.id_mantenimiento,
          estado: nextState,
          descripcion: notes,
          fecha_finalizacion: nextState === "En proceso" ? null : new Date().toISOString().slice(0, 10),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No fue posible actualizar el estado.");
      setNotice(`Orden #${selected.id_mantenimiento} actualizada a ${nextState}.`);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const saveNotes = async () => {
    if (!selected) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`${API_V1_BASE_URL}/usuarios/mantenimiento/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          id_mantenimiento: selected.id_mantenimiento,
          estado: selected.estado,
          descripcion: notes,
          fecha_finalizacion: selected.fecha_finalizacion || null,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No fue posible guardar las observaciones.");
      setNotice("Observaciones técnicas guardadas.");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateChecklist = async (item, estado) => {
    try {
      const response = await fetch(`${API_V1_BASE_URL}/usuarios/mantenimiento/${selected.id_mantenimiento}/checklist/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ codigo: item.codigo, nombre: item.nombre, estado, observacion: item.observacion || "" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No fue posible actualizar el checklist.");
      setChecklist((current) => current.map((entry) => entry.codigo === item.codigo ? data : entry));
      setNotice("Checklist actualizado.");
    } catch (err) { setError(err.message); }
  };

  const addPart = async (event) => {
    event.preventDefault();
    if (!partForm.id_articulo) return;
    try {
      const response = await fetch(`${API_V1_BASE_URL}/usuarios/mantenimiento/${selected.id_mantenimiento}/repuestos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ ...partForm, id_articulo: Number(partForm.id_articulo), cantidad: Number(partForm.cantidad) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No fue posible registrar el repuesto.");
      setParts((current) => [data, ...current]);
      setPartForm({ id_articulo: "", cantidad: "1", observacion: "" });
      setNotice("Repuesto registrado y descontado del inventario.");
      await loadArticles();
    } catch (err) { setError(err.message); }
  };

  const registerDelivery = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_V1_BASE_URL}/usuarios/mantenimiento/${selected.id_mantenimiento}/entrega/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(delivery),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No fue posible registrar la entrega.");
      setDelivery({ recibido_por: data.recibido_por || "", observaciones: data.observaciones || "" });
      setNotice("Entrega registrada. La orden puede pasar a Devuelto.");
    } catch (err) { setError(err.message); }
  };

  const saveTechnicalSheet = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_V1_BASE_URL}/usuarios/mantenimiento/${selected.id_mantenimiento}/ficha/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(technicalSheet),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No fue posible guardar la ficha técnica.");
      setTechnicalSheet((current) => ({ ...current, ...data }));
      setNotice("Recepción y diagnóstico estructurado guardados.");
    } catch (err) { setError(err.message); }
  };

  const printReceipt = () => {
    const receipt = window.open("", "_blank", "width=760,height=820");
    if (!receipt) return;
    receipt.document.write(`<html><head><title>Comprobante MNT-${selected.id_mantenimiento}</title><style>body{font-family:Arial;color:#222;padding:32px}h1{color:#8b6900}section{border-bottom:1px solid #ddd;padding:14px 0}small{color:#666}</style></head><body><h1>BikeGestión · Comprobante de servicio</h1><section><strong>Orden MNT-${selected.id_mantenimiento}</strong><br>${selected.nombre_articulo || "Artículo"}<br><small>Ingreso: ${dateLabel(selected.fecha_inicio)} · Entrega: ${dateLabel(new Date().toISOString())}</small></section><section><strong>Diagnóstico</strong><p>${technicalSheet.diagnostico_tecnico || selected.descripcion || "Sin diagnóstico"}</p></section><section><strong>Recomendaciones</strong><p>${technicalSheet.recomendaciones || delivery.observaciones || "Sin recomendaciones"}</p></section><section><strong>Recibido por:</strong> ${delivery.recibido_por}</section><script>window.print()</script></body></html>`);
    receipt.document.close();
  };

  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#ffd700]">Taller / Operación mecánica</p>
          <h1 className="mt-2 text-4xl font-black uppercase italic tracking-tight text-[#e3e2e2]">Cola de mantenimiento</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#d0c6ab]">Recibe, diagnostica, repara y entrega las bicicletas manteniendo la trazabilidad de cada servicio.</p>
        </div>
        <button type="button" onClick={() => setShowForm((value) => !value)} className="ui-action flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-xs font-black uppercase tracking-widest">
          <span className="material-symbols-outlined text-base">add_task</span>{showForm ? "Cerrar orden" : "Nueva orden"}
        </button>
      </div>

      {notice && <div className="rounded-xl border border-[#42e6a4]/40 bg-[#42e6a4]/10 p-3 text-sm text-[#42e6a4]">{notice}</div>}
      {error && <div className="rounded-xl border border-[#ff8f84]/40 bg-[#ff8f84]/10 p-3 text-sm text-[#ffb4ab]">{error}</div>}

      {showForm && (
        <form onSubmit={submitOrder} className="modular-card grid gap-4 rounded-2xl p-5 md:grid-cols-[minmax(280px,1.35fr)_180px_minmax(280px,1.5fr)_auto] md:items-end">
          <div className="relative">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#d0c6ab]">Artículo del inventario</label>
            <div className="mt-2 flex gap-2">
              <div className="relative min-w-0 flex-1"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#777]">search</span><input required value={articleQuery} onFocus={() => setArticlePickerOpen(true)} onChange={(event) => { setArticleQuery(event.target.value); setArticlePickerOpen(true); setForm((current) => ({ ...current, id_articulo: "" })); }} placeholder="Buscar por nombre..." className="input-mech w-full p-3 pl-9 text-sm text-white placeholder:text-[#777]" /></div>
              <select value={articleCategory} onChange={(event) => { setArticleCategory(event.target.value); setArticlePickerOpen(true); }} className="input-mech max-w-[130px] p-3 text-xs text-white"><option value="Todas">Todas las categorías</option>{categories.slice(1).map((category) => <option key={category} value={category}>{category}</option>)}</select>
            </div>
            {selectedArticle && !articlePickerOpen && <p className="mt-1 truncate text-[10px] text-[#42e6a4]">Seleccionado: {selectedArticle.nombre_articulo} · {selectedArticle.tipo_articulo || "General"}</p>}
            {articlePickerOpen && <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-72 overflow-y-auto rounded-xl border border-[#4d4732] bg-[#0d0e0f] p-2 shadow-2xl shadow-black/60">{articlesLoading ? <p className="p-4 text-xs text-[#d0c6ab]">Cargando inventario...</p> : filteredArticles.length === 0 ? <p className="p-4 text-xs text-[#d0c6ab]">No hay artículos para esta búsqueda.</p> : filteredArticles.map((article) => <button key={article.id_articulo} type="button" onClick={() => selectArticle(article)} className="flex w-full items-start justify-between gap-3 rounded-lg p-3 text-left hover:bg-[#1a1a1a]"><span className="min-w-0"><strong className="block truncate text-sm text-[#e3e2e2]">{article.nombre_articulo}</strong><span className="mt-1 block truncate text-[10px] uppercase tracking-wider text-[#ffd700]">{article.tipo_articulo || "General"}</span><span className="mt-1 block line-clamp-1 text-[10px] text-[#85857f]">{article.descripcion_articulo || "Sin descripción"}</span></span><span className="shrink-0 text-right text-[10px] text-[#d0c6ab]"><strong className="block text-[#42e6a4]">{article.cantidad_articulo ?? 0} uds</strong><span>disponibles</span></span></button>)}</div>}
          </div>
          <label className="text-[10px] font-black uppercase tracking-widest text-[#d0c6ab]">Fecha de ingreso
            <input required name="fecha_inicio" value={form.fecha_inicio} onChange={updateForm} type="date" className="input-mech mt-2 w-full p-3 text-sm text-white" />
          </label>
          <label className="text-[10px] font-black uppercase tracking-widest text-[#d0c6ab]">Descripción inicial / falla reportada
            <input required name="descripcion" value={form.descripcion} onChange={updateForm} placeholder="Ej. Cambio de kit de transmisión y revisión de frenos" className="input-mech mt-2 w-full p-3 text-sm text-white placeholder:text-[#777]" />
          </label>
          <button disabled={saving} className="ui-action rounded-lg px-5 py-3 text-xs font-black uppercase tracking-widest disabled:opacity-50">Registrar</button>
        </form>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="modular-card rounded-xl p-4"><p className="text-[10px] font-black uppercase tracking-widest text-[#d0c6ab]">Órdenes activas</p><strong className="mt-2 block text-3xl text-[#ffd700]">{counters["En proceso"]}</strong><span className="text-xs text-[#85857f]">Pendientes de diagnóstico o reparación</span></div>
        <div className="modular-card rounded-xl p-4"><p className="text-[10px] font-black uppercase tracking-widest text-[#d0c6ab]">Reparadas</p><strong className="mt-2 block text-3xl text-[#42e6a4]">{counters.Reparado}</strong><span className="text-xs text-[#85857f]">Listas para control y entrega</span></div>
        <div className="modular-card rounded-xl p-4"><p className="text-[10px] font-black uppercase tracking-widest text-[#d0c6ab]">Devueltas</p><strong className="mt-2 block text-3xl text-[#8fd7ff]">{counters.Devuelto}</strong><span className="text-xs text-[#85857f]">Servicios cerrados al cliente</span></div>
        <div className="modular-card rounded-xl p-4"><p className="text-[10px] font-black uppercase tracking-widest text-[#d0c6ab]">Total histórico</p><strong className="mt-2 block text-3xl text-[#e3e2e2]">{records.length}</strong><span className="text-xs text-[#85857f]">Registros asignados al taller</span></div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(420px,.95fr)]">
        <div className="overflow-hidden rounded-2xl border border-[#1f1f1f] bg-[#0a0a0a]">
          <div className="flex flex-col gap-3 border-b border-[#1f1f1f] bg-[#121212] p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">{["Todos", ...STATES].map((state) => <button key={state} type="button" onClick={() => setFilter(state)} className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${filter === state ? "bg-[#ffd700] text-black" : "border border-[#333] text-[#d0c6ab] hover:border-[#ffd700]"}`}>{state}{state !== "Todos" ? ` (${counters[state]})` : ` (${records.length})`}</button>)}</div>
            <div className="relative"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#777]">search</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar orden..." className="input-mech w-full py-2 pl-9 pr-3 text-xs text-white placeholder:text-[#777] md:w-48" /></div>
          </div>
          {loading ? <div className="p-10 text-center text-sm text-[#d0c6ab]">Cargando órdenes...</div> : <div className="divide-y divide-[#1f1f1f]">{filteredRecords.map((item) => { const meta = stateMeta(item.estado); return <button key={item.id_mantenimiento} type="button" onClick={() => setSelectedId(item.id_mantenimiento)} className={`flex w-full items-start gap-4 p-4 text-left transition hover:bg-[#121212] ${selectedId === item.id_mantenimiento ? "border-l-2 border-[#ffd700] bg-[#171603]" : "border-l-2 border-transparent"}`}><div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${meta.dot}`} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><strong className="font-mono text-sm text-[#ffd700]">MNT-{String(item.id_mantenimiento).padStart(4, "0")}</strong><span className={`text-[10px] font-black uppercase ${meta.tone}`}>{meta.label}</span></div><p className="mt-1 truncate text-sm text-[#e3e2e2]">{item.nombre_articulo || `Artículo #${item.id_articulo || "sin asignar"}`}</p><p className="mt-1 line-clamp-2 text-xs text-[#85857f]">{item.descripcion || "Sin descripción técnica"}</p><p className="mt-3 text-[10px] uppercase tracking-wider text-[#d0c6ab]">Ingreso {dateLabel(item.fecha_inicio)} · Mecánico {item.nombre_usuario || "Asignado"}</p></div><span className="material-symbols-outlined text-[#777]">chevron_right</span></button>; })}{filteredRecords.length === 0 && <div className="p-10 text-center text-sm text-[#d0c6ab]">No hay órdenes que coincidan con el filtro.</div>}</div>}
        </div>

        <div className="modular-card rounded-2xl p-5">
          {!selected ? <div className="flex min-h-80 flex-col items-center justify-center text-center text-[#d0c6ab]"><span className="material-symbols-outlined mb-3 text-4xl text-[#ffd700]">build_circle</span><p className="text-sm">Selecciona una orden para abrir su ficha técnica.</p></div> : <>
            <div className="flex items-start justify-between gap-4 border-b border-[#2c2d2d] pb-4"><div><p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ffd700]">Ficha técnica de servicio</p><h2 className="mt-2 text-2xl font-black uppercase italic text-[#e3e2e2]">MNT-{String(selected.id_mantenimiento).padStart(4, "0")}</h2></div><span className={`flex items-center gap-1.5 rounded-full bg-[#ffd700]/10 px-3 py-1 text-[10px] font-black uppercase ${stateMeta(selected.estado).tone}`}><span className="material-symbols-outlined text-sm">{stateMeta(selected.estado).icon}</span>{selected.estado}</span></div>
            <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-lg border border-[#2c2d2d] bg-[#0a0a0a] p-3"><p className="text-[10px] uppercase tracking-wider text-[#85857f]">Bicicleta / artículo</p><p className="mt-1 text-sm font-bold text-[#e3e2e2]">{selected.nombre_articulo || `Artículo #${selected.id_articulo || "sin asignar"}`}</p></div><div className="rounded-lg border border-[#2c2d2d] bg-[#0a0a0a] p-3"><p className="text-[10px] uppercase tracking-wider text-[#85857f]">Fecha de ingreso</p><p className="mt-1 text-sm font-bold text-[#e3e2e2]">{dateLabel(selected.fecha_inicio)}</p></div></div>
            <div className="mt-5 rounded-lg border border-[#2c2d2d] bg-[#0a0a0a] p-3 text-xs text-[#d0c6ab]">Responsable: <strong className="text-[#ffd700]">{selected.nombre_usuario || `Mecánico #${selected.id_usuario_mecanico}`}</strong>{!ownsSelected && <span className="ml-2 text-[#85857f]">(solo consulta; la edición corresponde al responsable)</span>}</div>
            <div className="mt-5"><p className="text-[10px] font-black uppercase tracking-widest text-[#d0c6ab]">Diagnóstico y trazabilidad</p><div className="mt-2 rounded-lg border border-[#2c2d2d] bg-[#0a0a0a] p-4 text-sm leading-relaxed text-[#e3e2e2]">{selected.descripcion || "No hay diagnóstico registrado."}</div></div>
            {ownsSelected && <><label className="mt-5 block text-[10px] font-black uppercase tracking-widest text-[#d0c6ab]">Observaciones técnicas finales<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows="4" placeholder="Añade pruebas realizadas, torque, repuestos o recomendaciones..." className="input-mech mt-2 w-full resize-y p-3 text-sm text-white placeholder:text-[#777]" /></label><div className="mt-2 flex justify-end"><button type="button" disabled={saving || notes === (selected.descripcion || "")} onClick={saveNotes} className="rounded-lg border border-[#4d4732] px-4 py-2 text-[10px] font-black uppercase tracking-wider text-[#d0c6ab] hover:border-[#ffd700] hover:text-[#ffd700] disabled:cursor-not-allowed disabled:opacity-40">Guardar notas técnicas</button></div>
            <form onSubmit={saveTechnicalSheet} className="mt-5 rounded-xl border border-[#2c2d2d] bg-[#0a0a0a] p-4"><div className="flex items-center justify-between gap-3"><p className="text-[10px] font-black uppercase tracking-widest text-[#d0c6ab]">Recepción y diagnóstico estructurado</p><select value={technicalSheet.prioridad} onChange={(event) => setTechnicalSheet((current) => ({ ...current, prioridad: event.target.value }))} className="input-mech p-2 text-[10px] text-white"><option>Baja</option><option>Media</option><option>Alta</option><option>Urgente</option></select></div><div className="mt-3 grid gap-2 sm:grid-cols-2"><textarea value={technicalSheet.falla_reportada} onChange={(event) => setTechnicalSheet((current) => ({ ...current, falla_reportada: event.target.value }))} placeholder="Falla reportada por el cliente" rows="2" className="input-mech p-3 text-xs text-white placeholder:text-[#777]" /><textarea value={technicalSheet.inspeccion_recepcion} onChange={(event) => setTechnicalSheet((current) => ({ ...current, inspeccion_recepcion: event.target.value }))} placeholder="Inspección de recepción y daños preexistentes" rows="2" className="input-mech p-3 text-xs text-white placeholder:text-[#777]" /><textarea value={technicalSheet.diagnostico_tecnico} onChange={(event) => setTechnicalSheet((current) => ({ ...current, diagnostico_tecnico: event.target.value }))} placeholder="Diagnóstico técnico" rows="2" className="input-mech p-3 text-xs text-white placeholder:text-[#777]" /><textarea value={technicalSheet.recomendaciones} onChange={(event) => setTechnicalSheet((current) => ({ ...current, recomendaciones: event.target.value }))} placeholder="Recomendaciones al cliente" rows="2" className="input-mech p-3 text-xs text-white placeholder:text-[#777]" /></div><button className="ui-action mt-3 rounded-lg px-4 py-2 text-[10px] font-black uppercase">Guardar ficha técnica</button></form>
            <div className="mt-5 rounded-xl border border-[#2c2d2d] bg-[#0a0a0a] p-4"><div className="flex items-center justify-between gap-3"><p className="text-[10px] font-black uppercase tracking-widest text-[#d0c6ab]">Checklist técnico</p><span className="text-[10px] text-[#85857f]">{checklist.filter((item) => item.estado === "Aprobado").length}/{checklist.length} aprobados</span></div><div className="mt-3 space-y-2">{checklist.map((item) => <div key={item.codigo} className="flex items-center justify-between gap-3 rounded-lg border border-[#242626] p-3"><span className="text-xs text-[#e3e2e2]">{item.nombre}</span><div className="flex gap-1">{["Pendiente", "Aprobado", "Rechazado"].map((state) => <button key={state} type="button" onClick={() => updateChecklist(item, state)} className={`rounded px-2 py-1 text-[9px] font-black uppercase ${item.estado === state ? state === "Aprobado" ? "bg-[#42e6a4] text-black" : state === "Rechazado" ? "bg-[#ff8f84] text-black" : "bg-[#ffd700] text-black" : "border border-[#333] text-[#85857f]"}`}>{state}</button>)}</div></div>)}</div></div>
            <div className="mt-5 rounded-xl border border-[#2c2d2d] bg-[#0a0a0a] p-4"><div className="flex items-center justify-between gap-3"><p className="text-[10px] font-black uppercase tracking-widest text-[#d0c6ab]">Repuestos y consumibles</p><span className="text-[10px] text-[#85857f]">Salida de inventario automática</span></div><form onSubmit={addPart} className="mt-3 grid gap-2 sm:grid-cols-[1fr_80px_auto]"><select required value={partForm.id_articulo} onChange={(event) => setPartForm((current) => ({ ...current, id_articulo: event.target.value }))} className="input-mech p-2 text-xs text-white"><option value="">Seleccionar repuesto</option>{articles.map((article) => <option key={article.id_articulo} value={article.id_articulo}>{article.nombre_articulo} · {article.cantidad_articulo ?? 0} uds</option>)}</select><input required min="1" type="number" value={partForm.cantidad} onChange={(event) => setPartForm((current) => ({ ...current, cantidad: event.target.value }))} className="input-mech p-2 text-xs text-white" /><button className="ui-action rounded-lg px-3 py-2 text-[10px] font-black uppercase">Agregar</button></form>{parts.length > 0 && <div className="mt-3 divide-y divide-[#242626]">{parts.map((part) => <div key={part.id_mantenimiento_repuesto} className="flex justify-between py-2 text-xs"><span className="text-[#e3e2e2]">{part.nombre_articulo}</span><strong className="text-[#ffd700]">{part.cantidad} uds</strong></div>)}</div>}</div>
            {selected.estado === "Reparado" && <form onSubmit={registerDelivery} className="mt-5 rounded-xl border border-[#2c2d2d] bg-[#0a0a0a] p-4"><p className="text-[10px] font-black uppercase tracking-widest text-[#d0c6ab]">Cierre y entrega</p><div className="mt-3 grid gap-2 sm:grid-cols-2"><input required value={delivery.recibido_por} onChange={(event) => setDelivery((current) => ({ ...current, recibido_por: event.target.value }))} placeholder="Nombre de quien recibe" className="input-mech p-3 text-xs text-white placeholder:text-[#777]" /><input value={delivery.observaciones} onChange={(event) => setDelivery((current) => ({ ...current, observaciones: event.target.value }))} placeholder="Recomendación o nota de entrega" className="input-mech p-3 text-xs text-white placeholder:text-[#777]" /></div><div className="mt-3 flex gap-2"><button className="ui-action rounded-lg px-4 py-2 text-[10px] font-black uppercase">Registrar entrega</button>{delivery.recibido_por && <button type="button" onClick={printReceipt} className="rounded-lg border border-[#4d4732] px-4 py-2 text-[10px] font-black uppercase text-[#d0c6ab] hover:border-[#ffd700] hover:text-[#ffd700]">Imprimir comprobante</button>}</div></form>}</>}
            {history.length > 0 && <details className="mt-5 rounded-xl border border-[#2c2d2d] bg-[#0a0a0a] p-4"><summary className="cursor-pointer text-[10px] font-black uppercase tracking-widest text-[#d0c6ab]">Bitácora de cambios ({history.length})</summary><div className="mt-3 space-y-2">{history.map((item) => <div key={item.id_historial} className="border-l border-[#ffd700] pl-3 text-xs"><p className="text-[#e3e2e2]">{item.estado_anterior || "Inicio"} → <strong className="text-[#ffd700]">{item.estado_nuevo}</strong></p><p className="text-[#85857f]">{item.nombre_usuario || "Mecánico"} · {dateLabel(item.fecha_cambio)}</p></div>)}</div></details>}
            <div className="mt-5"><p className="text-[10px] font-black uppercase tracking-widest text-[#d0c6ab]">Siguiente estado del servicio</p><div className="mt-2 grid gap-2 sm:grid-cols-3">{STATES.map((state) => <button key={state} type="button" disabled={saving || selected.estado === state} onClick={() => changeState(state)} className={`rounded-lg border px-3 py-3 text-[10px] font-black uppercase tracking-wider transition ${selected.estado === state ? "border-[#ffd700] bg-[#ffd700]/10 text-[#ffd700]" : "border-[#333] text-[#d0c6ab] hover:border-[#ffd700] hover:text-[#ffd700]"}`}>{state}</button>)}</div></div>
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#2c2d2d] pt-4"><span className="text-[10px] leading-relaxed text-[#85857f]">El estado actualizado queda registrado en la trazabilidad del taller.</span><button type="button" onClick={() => load()} className="shrink-0 rounded-lg border border-[#4d4732] px-3 py-2 text-[10px] font-black uppercase tracking-wider text-[#d0c6ab] hover:border-[#ffd700] hover:text-[#ffd700]">Actualizar</button></div>
          </>}
        </div>
      </div>
    </section>
  );
}

export default MantenimientoPanel;
