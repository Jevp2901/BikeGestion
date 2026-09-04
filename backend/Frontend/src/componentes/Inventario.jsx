import { useEffect, useMemo, useRef, useState } from "react";
import "../App.css";
import { API_BASE_URL, API_V1_BASE_URL, obtenerSesion } from "../utils/sesion";

const API_BASE = `${API_BASE_URL}`;
const readJson = async (response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`El servidor devolvió una respuesta inválida (${response.status}). Reinicia el backend.`);
  }
};

const RAZONES = ["Compra", "Venta", "Ajuste", "Pérdida", "Devolución", "Otro"];

const INITIAL_ARTICULO_FORM = {
  nombre_articulo: "",
  cantidad_articulo: "",
  descripcion_articulo: "",
  tipo_articulo: "",
  material: "",
  color: "",
  tamano: "",
  precio_articulo: "",
};

const INITIAL_MOVIMIENTO_FORM = {
  cantidad: "",
  razon: "Compra",
  observaciones: "",
};

const formatCurrency = (value) => `$${Number(value || 0).toLocaleString("es-CO")} COP`;

function StockAlertMonitor() {
  const [data, setData] = useState({ alertas: [], resumen: {} });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Todos");

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/inventario/alertas/`);
      if (!response.ok) throw new Error("No fue posible cargar las alertas de inventario.");
      setData(await readJson(response));
    } catch {
      setData({ alertas: [], resumen: {} });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(loadAlerts, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const alertas = data.alertas || [];
  const visibles = filter === "Todos" ? alertas : alertas.filter((item) => item.nivel === filter);
  const resumen = data.resumen || {};
  return <section className="col-span-12 overflow-hidden rounded-xl border border-[#3f371a] bg-[#11110e] shadow-[0_18px_50px_rgba(0,0,0,0.2)]"><div className="border-b border-[#302d20] p-5"><div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between"><div><div className="flex flex-wrap items-center gap-3"><h2 className="headline-kinetic text-2xl uppercase text-[#f3f1ea]">Monitor de alertas de stock bajo</h2>{!loading && <span className="rounded bg-[#5b201c] px-2 py-1 text-[9px] font-black uppercase text-[#ffb4ab]">{alertas.length} artículos en alerta</span>}</div><p className="mt-1 text-[11px] text-[#aaa79d]">Alertas calculadas con el stock mínimo configurado por artículo.</p></div><div className="flex flex-wrap gap-2"><button onClick={loadAlerts} className="rounded-lg border border-[#393522] px-3 py-2 text-[10px] font-black uppercase text-[#d0c6ab] hover:border-[#ffd700] hover:text-[#ffd700]">Actualizar vista</button><button onClick={() => { window.location.href = "/compras"; }} disabled={!alertas.length} className="rounded-lg bg-[#ffd700] px-3 py-2 text-[10px] font-black uppercase text-black disabled:cursor-not-allowed disabled:opacity-40">Ver compras sugeridas</button></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><div className="rounded-lg border-l-2 border-[#ff594e] bg-[#191311] p-3"><p className="text-[9px] uppercase text-[#aaa79d]">Nivel crítico</p><strong className="mt-1 block text-2xl text-[#ff8f84]">{resumen.criticas || 0}</strong><span className="text-[9px] text-[#ffb4ab]">Acción inmediata</span></div><div className="rounded-lg border-l-2 border-[#ffd700] bg-[#19170f] p-3"><p className="text-[9px] uppercase text-[#aaa79d]">Reposición</p><strong className="mt-1 block text-2xl text-[#ffd700]">{resumen.reposicion || 0}</strong><span className="text-[9px] text-[#d0c06d]">Orden recomendada</span></div><div className="rounded-lg border-l-2 border-[#72b7ff] bg-[#111820] p-3"><p className="text-[9px] uppercase text-[#aaa79d]">Inversión sugerida</p><strong className="mt-1 block text-xl text-[#9bceff]">{formatCurrency(resumen.inversion_estimada)}</strong><span className="text-[9px] text-[#8aa6c0]">{resumen.unidades_sugeridas || 0} unidades</span></div><div className="rounded-lg border-l-2 border-[#42e6a4] bg-[#101b17] p-3"><p className="text-[9px] uppercase text-[#aaa79d]">Regla de alerta</p><strong className="mt-1 block text-xl text-[#42e6a4]">25% - 75%</strong><span className="text-[9px] text-[#84c6a8]">del stock mínimo</span></div></div></div>{loading ? <div className="p-10 text-center text-sm text-[#aaa79d]">Analizando niveles de inventario...</div> : !alertas.length ? <div className="p-10 text-center text-sm text-[#42e6a4]">No hay artículos bajo el nivel de reposición.</div> : <div><div className="flex items-center justify-between gap-3 border-b border-[#24231b] px-5 py-3"><p className="text-[10px] font-black uppercase tracking-wider text-[#ffd700]">Artículos en alerta</p><div className="flex gap-1"><button onClick={() => setFilter("Todos")} className={`rounded px-2 py-1 text-[9px] font-bold ${filter === "Todos" ? "bg-[#ffd700] text-black" : "text-[#aaa79d]"}`}>Todos ({alertas.length})</button><button onClick={() => setFilter("Crítico")} className={`rounded px-2 py-1 text-[9px] font-bold ${filter === "Crítico" ? "bg-[#5b201c] text-[#ffb4ab]" : "text-[#aaa79d]"}`}>Críticos</button><button onClick={() => setFilter("Reposición")} className={`rounded px-2 py-1 text-[9px] font-bold ${filter === "Reposición" ? "bg-[#5b4c00] text-[#ffe55c]" : "text-[#aaa79d]"}`}>Reposición</button></div></div><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-[10px]"><thead className="bg-[#16150f] uppercase tracking-wider text-[#8f8a70]"><tr><th className="p-3">Artículo</th><th className="p-3">Categoría</th><th className="p-3 text-right">Actual / mínimo</th><th className="p-3 text-right">Reposición</th><th className="p-3">Proveedor activo</th><th className="p-3 text-right">Acción</th></tr></thead><tbody className="divide-y divide-[#24231b]">{visibles.map((item) => <tr key={item.id_articulo} className="hover:bg-[#18170f]"><td className="p-3"><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${item.nivel === "Crítico" ? "bg-[#ff594e]" : "bg-[#ffd700]"}`} /><div><strong className="text-[#eeeade]">{item.nombre_articulo}</strong><p className="text-[9px] text-[#77705a]">ART-{String(item.id_articulo).padStart(4, "0")}</p></div></div></td><td className="p-3 text-[#aaa79d]">{item.tipo_articulo || "General"}</td><td className="p-3 text-right"><strong className={item.nivel === "Crítico" ? "text-[#ff8f84]" : "text-[#ffe55c]"}>{item.stock_actual} uds</strong><span className="block text-[9px] text-[#77705a]">mínimo: {item.stock_minimo}</span></td><td className="p-3 text-right"><strong className="text-[#ffe55c]">+{item.sugerencia_reposicion} uds</strong><span className="block text-[9px] text-[#77705a]">{formatCurrency(item.inversion_estimada)}</span></td><td className="p-3">{item.nombre_proveedor ? <><strong className="text-[#eeeade]">{item.nombre_proveedor}</strong><span className="block text-[9px] text-[#42e6a4]">Activo · NIT {item.nit_proveedor}</span></> : <span className="text-[#ffb4ab]">Sin proveedor activo</span>}</td><td className="p-3 text-right"><button onClick={() => { window.location.href = "/compras"; }} className="rounded bg-[#ffd700] px-2 py-1.5 text-[9px] font-black uppercase text-black">Crear compra</button></td></tr>)}</tbody></table></div></div>}</section>;
}

function Inventario() {
  const usuarioSesion = useMemo(() => obtenerSesion(), []);
  const toastTimerRef = useRef(null);
  const itemsPorPagina = 5;

  const [articulos, setArticulos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [loadingArticulos, setLoadingArticulos] = useState(true);
  const [loadingMovimientos, setLoadingMovimientos] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [paginaInventario, setPaginaInventario] = useState(0);

  const [showArticuloModal, setShowArticuloModal] = useState(false);
  const [editingArticulo, setEditingArticulo] = useState(null);
  const [articuloForm, setArticuloForm] = useState(INITIAL_ARTICULO_FORM);
  const [submittingArticulo, setSubmittingArticulo] = useState(false);

  const [showMovimientoModal, setShowMovimientoModal] = useState(false);
  const [movementTarget, setMovementTarget] = useState(null);
  const [movementType, setMovementType] = useState("Entrada");
  const [movementForm, setMovementForm] = useState(INITIAL_MOVIMIENTO_FORM);
  const [submittingMovimiento, setSubmittingMovimiento] = useState(false);
  const [movementError, setMovementError] = useState("");

  const fetchArticulos = async () => {
    setLoadingArticulos(true);
    try {
      const res = await fetch(`${API_BASE}/articulos/`);
      if (!res.ok) throw new Error("Error al cargar artículos");
      const data = await res.json();
      setArticulos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingArticulos(false);
    }
  };

  const fetchMovimientos = async () => {
    setLoadingMovimientos(true);
    try {
      const responses = await Promise.all([
        fetch(`${API_BASE}/movimientos/?limit=20`),
        fetch(`${API_V1_BASE_URL}/ventas/`),
        fetch(`${API_V1_BASE_URL}/compras/`),
      ]);
      const [manualData, ventasData, comprasData] = await Promise.all(responses.map(readJson));
      if (!responses[0].ok) throw new Error("No se pudo cargar el historial");

      const ventasMovimientos = (Array.isArray(ventasData) ? ventasData : []).flatMap((venta) =>
        (venta.detalles || []).map((detalle, index) => ({
          id_movimiento: `venta-${venta.id_venta}-${detalle.id_articulo}-${index}`,
          tipo_movimiento: "Salida",
          razon: "Venta",
          cantidad: detalle.cantidad_articulo,
          nombre_articulo: detalle.nombre_articulo || `Artículo #${detalle.id_articulo}`,
          fecha_movimiento: venta.fecha_venta,
          nombre_usuario: "Venta registrada",
          observaciones: `Venta #${venta.id_venta}${venta.nombre_cliente ? ` · Cliente: ${venta.nombre_cliente}` : ""}`,
          origen: "Venta",
          automatico: true,
        }))
      );
      const comprasMovimientos = (Array.isArray(comprasData) ? comprasData : []).flatMap((compra) =>
        (compra.detalles || []).map((detalle, index) => ({
          id_movimiento: `compra-${compra.id_compra}-${detalle.id_articulo}-${index}`,
          tipo_movimiento: "Entrada",
          razon: "Compra",
          cantidad: detalle.cantidad_articulo,
          nombre_articulo: detalle.nombre_articulo || `Artículo #${detalle.id_articulo}`,
          fecha_movimiento: compra.fecha_compra,
          nombre_usuario: "Compra registrada",
          observaciones: `Compra #${compra.id_compra}${compra.nombre_proveedor ? ` · Proveedor: ${compra.nombre_proveedor}` : ""}`,
          origen: "Compra",
          automatico: true,
        }))
      );
      const allMovements = [
        ...(Array.isArray(manualData) ? manualData : []),
        ...ventasMovimientos,
        ...comprasMovimientos,
      ].sort((a, b) => new Date(b.fecha_movimiento || 0) - new Date(a.fecha_movimiento || 0));
      setMovimientos(allMovements);
    } catch (err) {
      setError(err.message);
      setMovimientos([]);
    } finally {
      setLoadingMovimientos(false);
    }
  };

  const refreshData = async () => {
    await Promise.all([fetchArticulos(), fetchMovimientos()]);
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 5000);
  };

  const openArticuloCreateModal = () => {
    setEditingArticulo(null);
    setArticuloForm(INITIAL_ARTICULO_FORM);
    setShowArticuloModal(true);
  };

  const openArticuloEditModal = (articulo) => {
    setEditingArticulo(articulo);
    setArticuloForm({
      nombre_articulo: articulo.nombre_articulo ?? "",
      cantidad_articulo: articulo.cantidad_articulo ?? "",
      descripcion_articulo: articulo.descripcion_articulo ?? "",
      tipo_articulo: articulo.tipo_articulo ?? "",
      material: articulo.material ?? "",
      color: articulo.color ?? "",
      tamano: articulo.tamano ?? "",
      precio_articulo: articulo.precio_articulo ?? "",
    });
    setShowArticuloModal(true);
  };

  const openMovimientoModal = (articulo, tipo) => {
    if (!articulo) {
      showToast("Artículo no encontrado", "error");
      return;
    }
    setMovementTarget(articulo);
    setMovementType(tipo);
    setMovementForm(INITIAL_MOVIMIENTO_FORM);
    setMovementError("");
    setShowMovimientoModal(true);
  };

  const handleArticuloChange = (e) => {
    const { name, value } = e.target;
    setArticuloForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleArticuloPriceChange = (e) => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    if (raw === "") {
      setArticuloForm((prev) => ({ ...prev, precio_articulo: "" }));
      return;
    }
    const padded = raw.padStart(3, "0");
    const integer = padded.slice(0, -2);
    const decimals = padded.slice(-2);
    const clean = `${parseInt(integer, 10)}.${decimals}`;
    setArticuloForm((prev) => ({ ...prev, precio_articulo: clean }));
  };

  const handleMovimientoChange = (e) => {
    const { name, value } = e.target;
    setMovementForm((prev) => ({ ...prev, [name]: value }));
    setMovementError("");
  };

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString("es-CO", {
      minimumFractionDigits: 2,
    });

  const normalizarTexto = (value) =>
    String(value || "")
      .toLowerCase()
      .trim();

  const filteredArticulos = useMemo(() => {
    const query = normalizarTexto(searchTerm);
    const base = [...articulos].sort((a, b) => Number(b.id_articulo) - Number(a.id_articulo));
    if (!query) return base;
    return base.filter((articulo) =>
      [
        articulo.nombre_articulo,
        articulo.tipo_articulo,
        articulo.descripcion_articulo,
        articulo.material,
        articulo.color,
        articulo.tamano,
      ].some((campo) => normalizarTexto(campo).includes(query))
    );
  }, [articulos, searchTerm]);

  const totalPaginas = Math.max(1, Math.ceil(filteredArticulos.length / itemsPorPagina));
  const paginaSegura = Math.min(paginaInventario, totalPaginas - 1);
  const articulosVisibles = filteredArticulos.slice(
    paginaSegura * itemsPorPagina,
    paginaSegura * itemsPorPagina + itemsPorPagina
  );

  const getStockStatus = (articulo) => {
    const qty = articulo.cantidad_articulo ?? 0;
    if (qty <= 0) return { label: "Sin Stock", class: "text-[#d0c6ab]/60", dot: "bg-[#555]" };
    if (qty <= 5) return { label: "Stock Bajo", class: "text-[#ffb4ab]", dot: "bg-[#ffb4ab] animate-pulse" };
    return { label: "En Stock", class: "text-[#4ADE80]", dot: "bg-[#4ADE80]" };
  };

  const validateMovimiento = () => {
    if (!movementTarget) return "Artículo no encontrado";
    const cantidad = Number(movementForm.cantidad);
    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      return "Cantidad debe ser mayor a 0";
    }
    if (movementType === "Salida" && cantidad > (movementTarget.cantidad_articulo ?? 0)) {
      return "Stock insuficiente";
    }
    if (!movementForm.razon) {
      return "Selecciona una razón";
    }
    return "";
  };

  const handleArticuloSubmit = async (e) => {
    e.preventDefault();
    setSubmittingArticulo(true);
    setError("");

    const { cantidad_articulo, ...payload } = articuloForm;
    if (payload.precio_articulo !== "") {
      payload.precio_articulo = parseFloat(payload.precio_articulo);
    }

    try {
      const url = editingArticulo
        ? `${API_BASE}/articulos/${editingArticulo.id_articulo}/`
        : `${API_BASE}/articulos/`;
      const method = editingArticulo ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await res.json() : {};

      if (!res.ok) {
        throw new Error(
          typeof data === "object" ? JSON.stringify(data) : "Error al guardar el artículo"
        );
      }

      showToast(
        editingArticulo ? "Artículo actualizado correctamente" : "Artículo creado correctamente",
        "success"
      );
      setShowArticuloModal(false);
      setEditingArticulo(null);
      await fetchArticulos();
    } catch (err) {
      setError(err.message);
      showToast(err.message, "error");
    } finally {
      setSubmittingArticulo(false);
    }
  };

  const handleArticuloDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este artículo?")) return;
    setError("");
    try {
      const res = await fetch(`${API_BASE}/articulos/${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar artículo");
      showToast("Artículo eliminado correctamente", "success");
      await fetchArticulos();
    } catch (err) {
      setError(err.message);
      showToast(err.message, "error");
    }
  };

  const handleMovimientoSubmit = async (e) => {
    e.preventDefault();
    setMovementError("");
    setError("");

    const validationMessage = validateMovimiento();
    if (validationMessage) {
      setMovementError(validationMessage);
      showToast(validationMessage, "error");
      return;
    }

    if (!usuarioSesion?.id) {
      const message = "No se pudo identificar el usuario autenticado";
      setMovementError(message);
      showToast(message, "error");
      return;
    }

    const cantidad = Number(movementForm.cantidad);
    const observacionesLimpias = (movementForm.observaciones || "")
      .replace(/[<>]/g, "")
      .trim()
      .slice(0, 200);

    const payload = {
      id_articulo: movementTarget.id_articulo,
      id_usuario: usuarioSesion.id,
      tipo_movimiento: movementType,
      cantidad,
      razon: movementForm.razon,
      observaciones: observacionesLimpias || null,
    };

    setSubmittingMovimiento(true);
    try {
      const res = await fetch(`${API_BASE}/movimientos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await res.json() : {};

      if (!res.ok) {
        const apiMessage =
          (data && typeof data === "object" && (data.error || data.detail || data.cantidad || data.id_articulo || data.id_usuario)) ||
          "No fue posible registrar el movimiento";
        throw new Error(
          typeof apiMessage === "string" ? apiMessage : JSON.stringify(data)
        );
      }

      showToast("Movimiento registrado correctamente", "success");
      setShowMovimientoModal(false);
      setMovementTarget(null);
      setMovementForm(INITIAL_MOVIMIENTO_FORM);
      await refreshData();
    } catch (err) {
      setMovementError(err.message);
      showToast(err.message, "error");
    } finally {
      setSubmittingMovimiento(false);
    }
  };

  const eliminarMovimiento = async (idMovimiento) => {
    if (!window.confirm("¿Eliminar este movimiento y revertir el stock?")) return;
    try {
      const res = await fetch(`${API_BASE}/movimientos/${idMovimiento}/`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "No fue posible eliminar el movimiento");
      }
      showToast("Movimiento eliminado y stock revertido", "success");
      await refreshData();
    } catch (err) {
      setError(err.message);
      showToast(err.message, "error");
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";
    const date = new Date(fecha);
    if (Number.isNaN(date.getTime())) return fecha;

    const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diffMinutes < 1) return "Hace unos segundos";
    if (diffMinutes < 60) return `Hace ${diffMinutes} min`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Hace ${diffHours} h`;

    return date.toLocaleString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const movementSummary = useMemo(() => {
    const entradas = movimientos.filter((m) => m.tipo_movimiento === "Entrada").length;
    const salidas = movimientos.filter((m) => m.tipo_movimiento === "Salida").length;
    const neto = movimientos.reduce((acc, movimiento) => {
      const qty = Number(movimiento.cantidad || 0);
      return acc + (movimiento.tipo_movimiento === "Entrada" ? qty : -qty);
    }, 0);
    return { entradas, salidas, neto };
  }, [movimientos]);

  const ultimoMovimientoPorArticulo = useMemo(() => {
    const mapa = new Map();
    movimientos.forEach((movimiento) => {
      if (!mapa.has(String(movimiento.id_articulo))) mapa.set(String(movimiento.id_articulo), movimiento);
    });
    return mapa;
  }, [movimientos]);

  // El monitor superior es la fuente única de alertas calculadas con stock mínimo.
  const lowStockArticulos = [];
  const latestArticulos = useMemo(
    () => [...articulos].sort((a, b) => Number(b.id_articulo) - Number(a.id_articulo)).slice(0, 5),
    [articulos]
  );

  useEffect(() => {
    setPaginaInventario(0);
  }, [searchTerm]);

  return (
    <div className="grid grid-cols-12 gap-8">
      {toast && (
        <div
          className={`fixed right-6 top-6 z-[60] max-w-md rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-md ${
            toast.type === "success"
              ? "border-[#4ADE80]/40 bg-[#0b1b10]/95 text-[#4ADE80]"
              : "border-[#ffb4ab]/40 bg-[#220d0d]/95 text-[#ffb4ab]"
          }`}
        >
          <p className="text-sm font-bold uppercase tracking-widest">{toast.message}</p>
        </div>
      )}

      <StockAlertMonitor />

      <div className="col-span-12 lg:col-span-8 space-y-8">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <h2 className="headline-kinetic text-4xl uppercase text-[#e3e2e2]">
                Gestión de Inventario y Movimientos
              </h2>
              <p className="mt-1 font-medium text-[#d0c6ab]">
                Control de entradas, salidas y ajuste automático del stock sobre `articulo`.
              </p>
            </div>
            <span className="self-start rounded-sm border border-[#4d4732] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#d0c6ab]">
              Catálogo gestionado por Compras
            </span>
          </div>

          <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
            <div className="w-full max-w-xl">
              <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-[#d0c6ab]">
                Buscar artículos
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#ffd700]">
                  search
                </span>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, categoría, color, material..."
                  className="w-full rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] py-3 pl-11 pr-4 text-sm text-[#e3e2e2] outline-none transition-all placeholder:text-[#555] focus:border-[#ffd700]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 self-start xl:self-end">
              <button
                type="button"
                onClick={() => setPaginaInventario((prev) => Math.max(0, prev - 1))}
                disabled={paginaSegura === 0}
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] text-[#d0c6ab] transition-all hover:border-[#ffd700] hover:text-[#ffd700] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Página anterior"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <div className="rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] px-4 py-2 text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#d0c6ab]">Página</p>
                <p className="text-sm font-bold text-[#e3e2e2]">
                  {Math.min(paginaSegura + 1, totalPaginas)} / {totalPaginas}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPaginaInventario((prev) => Math.min(totalPaginas - 1, prev + 1))}
                disabled={paginaSegura >= totalPaginas - 1}
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] text-[#d0c6ab] transition-all hover:border-[#ffd700] hover:text-[#ffd700] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Página siguiente"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="break-all rounded-sm border border-[#ffb4ab] bg-[#ffb4ab]/10 px-4 py-3 text-sm text-[#ffb4ab]">
            {error}
          </div>
        )}

        {loadingArticulos ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ffd700] border-t-transparent" />
            <span className="ml-3 text-sm text-[#d0c6ab]">Cargando artículos...</span>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#0a0a0a]">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#121212]">
                    <th className="p-4 text-xs uppercase tracking-widest text-[#ffd700]">Código</th>
                    <th className="w-[220px] p-4 text-xs uppercase tracking-widest text-[#d0c6ab]">
                      Nombre
                    </th>
                    <th className="p-4 text-xs uppercase tracking-widest text-[#d0c6ab]">Categoría</th>
                    <th className="p-4 text-right text-xs uppercase tracking-widest text-[#d0c6ab]">Stock</th>
                    <th className="p-4 text-right text-xs uppercase tracking-widest text-[#d0c6ab]">Precio unitario</th>
                    <th className="p-4 text-right text-xs uppercase tracking-widest text-[#d0c6ab]">Precio venta</th>
                    <th className="p-4 text-right text-xs uppercase tracking-widest text-[#d0c6ab]">Precio compra</th>
                    <th className="p-4 text-right text-xs uppercase tracking-widest text-[#d0c6ab]">Ganancia</th>
                    <th className="p-4 text-xs uppercase tracking-widest text-[#d0c6ab]">Estado</th>
                    <th className="w-[210px] p-4 text-xs uppercase tracking-widest text-[#d0c6ab]">
                      Origen del movimiento
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]">
                  {articulos.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-sm text-[#d0c6ab]">
                        No hay artículos registrados
                      </td>
                    </tr>
                  ) : (
                    articulosVisibles.map((articulo) => {
                      const status = getStockStatus(articulo);
                      const stockActual = articulo.cantidad_articulo ?? 0;
                      const ultimoMovimiento = ultimoMovimientoPorArticulo.get(String(articulo.id_articulo));
                      return (
                        <tr key={articulo.id_articulo} className="transition-colors hover:bg-[#121212]">
                          <td className="p-4 font-mono text-xs text-[#d0c6ab]">
                            ART-{String(articulo.id_articulo).padStart(4, "0")}
                          </td>
                          <td className="w-[220px] max-w-[220px] p-4">
                            <div className="max-w-[200px] truncate font-bold text-[#e3e2e2]">
                              {articulo.nombre_articulo}
                            </div>
                            {articulo.descripcion_articulo && (
                              <div className="max-w-[200px] truncate text-[10px] font-black uppercase text-[#d0c6ab]/60">
                                {articulo.descripcion_articulo}
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="rounded bg-[#1a1a1a] px-2 py-1 text-[10px] font-extrabold uppercase text-[#d0c6ab]">
                              {articulo.tipo_articulo || "General"}
                            </span>
                          </td>
                          <td className="p-4 text-right font-bold text-[#e3e2e2]">{stockActual}</td>
                          <td className="p-4 text-right font-bold text-[#ffd700]">
                            ${formatPrice(articulo.precio_articulo)}
                          </td>
                          <td className="p-4 text-right font-bold text-[#e3e2e2]">
                            ${formatPrice(articulo.precio_articulo)}
                          </td>
                          <td className="p-4 text-right text-xs font-bold text-[#d0c6ab]">
                            {articulo.precio_compra != null ? `$${formatPrice(articulo.precio_compra)}` : "Sin compras"}
                          </td>
                          <td className="p-4 text-right text-xs font-black text-[#ffd700]">
                            {articulo.porcentaje_ganancia != null ? `${Number(articulo.porcentaje_ganancia).toLocaleString("es-CO")} %` : "No definido"}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                              <span className={`text-[10px] font-black uppercase ${status.class}`}>
                                {status.label}
                              </span>
                            </div>
                          </td>
                          <td className="w-[210px] align-middle p-4 text-[10px] text-[#d0c6ab]">
                            {ultimoMovimiento ? <div><span className={`inline-flex items-center gap-2 rounded border px-3 py-2 font-bold uppercase ${ultimoMovimiento.tipo_movimiento === "Entrada" ? "border-[#065f46] bg-[#06281f] text-[#4ADE80]" : "border-[#7c2d12] bg-[#30130b] text-[#ffb4ab]"}`}><span className="material-symbols-outlined text-sm">{ultimoMovimiento.tipo_movimiento === "Entrada" ? "download" : "upload"}</span>{ultimoMovimiento.observaciones || ultimoMovimiento.razon}</span><p className="mt-1 text-[9px] text-[#777870]">{formatearFecha(ultimoMovimiento.fecha_movimiento)}</p></div> : <span className="text-[#777870]">Sin movimientos registrados</span>}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="col-span-12 space-y-6 lg:col-span-4">
        <div className="rounded-xl border border-[#1a1a1a] bg-[#121212] p-6">
          <div className="mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffd700]">moving</span>
            <h3 className="headline-kinetic text-xl uppercase text-[#e3e2e2]">
              Control de Movimientos
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] p-3">
              <p className="text-[10px] uppercase tracking-widest text-[#d0c6ab]">Entradas</p>
              <p className="mt-1 text-xl font-bold text-[#4ADE80]">{movementSummary.entradas}</p>
            </div>
            <div className="rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] p-3">
              <p className="text-[10px] uppercase tracking-widest text-[#d0c6ab]">Salidas</p>
              <p className="mt-1 text-xl font-bold text-[#ffb4ab]">{movementSummary.salidas}</p>
            </div>
            <div className="rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] p-3">
              <p className="text-[10px] uppercase tracking-widest text-[#d0c6ab]">Neto</p>
              <p className={`mt-1 text-xl font-bold ${movementSummary.neto >= 0 ? "text-[#4ADE80]" : "text-[#ffb4ab]"}`}>
                {movementSummary.neto >= 0 ? "+" : ""}
                {movementSummary.neto}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-[10px] uppercase tracking-widest text-[#d0c6ab]">
              Operador autenticado
            </p>
            <div className="rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3">
              <p className="font-bold text-[#e3e2e2]">{usuarioSesion?.nombre || "Usuario"}</p>
              <p className="text-xs text-[#d0c6ab]">ID usuario: {usuarioSesion?.id ?? "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#1a1a1a] bg-[#121212] p-6">
          <div className="mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffd700]">history</span>
            <h3 className="headline-kinetic text-xl uppercase text-[#e3e2e2]">
              Últimas entradas y salidas
            </h3>
          </div>

          {loadingMovimientos ? (
            <div className="flex items-center justify-center py-10">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#ffd700] border-t-transparent" />
            </div>
          ) : movimientos.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#1f1f1f] bg-[#0a0a0a] p-6 text-center">
              <p className="text-sm text-[#e3e2e2]">No hay movimientos registrados todavía</p>
              <p className="mt-2 text-[11px] text-[#d0c6ab]">
                Aquí aparecerán las entradas por compras y las salidas por ventas, junto con los movimientos manuales.
              </p>
            </div>
          ) : (
            <div className="max-h-[400px] space-y-3 overflow-y-auto pr-1">
              {movimientos.slice(0, 10).map((movimiento) => {
                const isEntrada = movimiento.tipo_movimiento === "Entrada";
                const qty = Number(movimiento.cantidad || 0);
                return (
                  <div
                    key={movimiento.id_movimiento}
                    className="group rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] p-4 transition-colors hover:border-[#ffd700]/30"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <span
                          className={`mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
                            isEntrada
                              ? "bg-[#4ADE80]/10 text-[#4ADE80]"
                              : "bg-[#ffb4ab]/10 text-[#ffb4ab]"
                          }`}
                        >
                          {isEntrada ? `+${qty}` : `-${qty}`}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-[#e3e2e2]">
                            {movimiento.nombre_articulo}
                          </h4>
                          <p className="text-[11px] text-[#d0c6ab]">
                            {movimiento.tipo_movimiento} - {movimiento.razon}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#d0c6ab]/80">{formatearFecha(movimiento.fecha_movimiento)}</p>
                    <p className="mt-1 text-[11px] text-[#d0c6ab]">Origen: {movimiento.origen || "Movimiento manual"} · {movimiento.nombre_usuario}</p>
                    {movimiento.observaciones && (
                      <p className="mt-2 line-clamp-3 text-[11px] text-[#e3e2e2]">
                        {movimiento.observaciones}
                      </p>
                    )}
                    <p className="mt-2 text-[11px] text-[#d0c6ab]">
                      Stock actualizado:{" "}
                      <span className="font-bold text-[#e3e2e2]">
                        {movimiento.nuevo_stock ?? movimiento.stock_actualizado_a ?? "N/A"}
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[#1a1a1a] bg-[#121212] p-6">
          <div className="mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffd700]">inventory_2</span>
            <h3 className="headline-kinetic text-xl uppercase text-[#e3e2e2]">
              Últimos Artículos Registrados
            </h3>
          </div>
          {latestArticulos.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#d0c6ab]">No hay artículos para mostrar</p>
          ) : (
            <div className="space-y-3">
              {latestArticulos.map((articulo) => {
                const qty = articulo.cantidad_articulo ?? 0;
                const isCritical = qty <= 0;
                return (
                  <div
                    key={articulo.id_articulo}
                    className="rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] p-4"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-[#e3e2e2]">
                          {articulo.nombre_articulo}
                        </h4>
                        <p className="mt-1 text-[11px] text-[#d0c6ab]">
                          {articulo.tipo_articulo || "General"} · ART-{String(articulo.id_articulo).padStart(4, "0")}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-black uppercase ${
                          isCritical ? "text-[#ffb4ab]" : "text-[#4ADE80]"
                        }`}
                      >
                        {isCritical ? "Stock bajo" : "Reciente"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#d0c6ab]">
                      <span>
                        Stock: <span className="font-bold text-[#e3e2e2]">{qty}</span>
                      </span>
                      <span>${formatPrice(articulo.precio_articulo)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[#1a1a1a] bg-[#121212] p-6">
          <div className="mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffd700]">warning</span>
            <h3 className="headline-kinetic text-xl uppercase text-[#e3e2e2]">
              Alertas de Stock
            </h3>
          </div>
          {lowStockArticulos.length === 0 ? (
            <p className="text-center text-sm text-[#d0c6ab]">No hay alertas de stock</p>
          ) : (
            <div className="space-y-4">
              {lowStockArticulos.map((articulo) => {
                const qty = articulo.cantidad_articulo ?? 0;
                const critical = qty <= 0;
                return (
                  <div
                    key={articulo.id_articulo}
                    className={`rounded-lg border-l-2 bg-[#0a0a0a] p-4 ${
                      critical ? "border-[#ffb4ab]" : "border-[#ffd700]"
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <span className="text-[10px] font-black uppercase text-[#d0c6ab]">
                        {critical ? "Sin Stock" : "Stock Bajo"}
                      </span>
                      <span className={`text-[10px] font-mono ${critical ? "text-[#ffb4ab]" : "text-[#ffd700]"}`}>
                        {qty <= 0 ? "0 unidades" : `${qty} unidades`}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#e3e2e2]">{articulo.nombre_articulo}</h4>
                    <p className="mt-1 text-[11px] text-[#d0c6ab]">
                      {articulo.descripcion_articulo || "Sin descripción"}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showArticuloModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="relative mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-[#ffd700]/20 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] shadow-2xl shadow-[#ffd700]/5">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#ffd700]/10 bg-[#1a1a1a]/95 px-6 py-5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ffd700]/10">
                  <span className="material-symbols-outlined text-lg text-[#ffd700]">
                    {editingArticulo ? "edit" : "add_circle"}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#e3e2e2]">
                  {editingArticulo ? "Editar Artículo" : "Nuevo Artículo"}
                </h3>
              </div>
              <button
                onClick={() => setShowArticuloModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#d0c6ab] transition-all hover:bg-[#ffd700]/10 hover:text-[#ffd700]"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleArticuloSubmit} className="space-y-5 p-6">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-[#ffd700]/80">
                    Nombre del Artículo <span className="text-[#ffb4ab]">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre_articulo"
                    value={articuloForm.nombre_articulo}
                    onChange={handleArticuloChange}
                    required
                    placeholder="Ej: Casco Giro Aether MIPS"
                    className="w-full rounded-lg border border-[#333] bg-[#121212] px-4 py-2.5 text-sm text-[#e3e2e2] transition-all placeholder:text-[#555] focus:border-[#ffd700] focus:outline-none focus:ring-1 focus:ring-[#ffd700]/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-[#ffd700]/80">
                    Precio <span className="text-[#ffb4ab]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#d0c6ab]">
                      $
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      name="precio_articulo"
                      value={articuloForm.precio_articulo}
                      onChange={handleArticuloPriceChange}
                      required
                      placeholder="0.00"
                      className="w-full rounded-lg border border-[#333] bg-[#121212] py-2.5 pl-8 pr-4 text-sm text-[#e3e2e2] transition-all placeholder:text-[#555] focus:border-[#ffd700] focus:outline-none focus:ring-1 focus:ring-[#ffd700]/30"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-[#ffd700]/80">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    name="cantidad_articulo"
                    value={articuloForm.cantidad_articulo}
                    onChange={handleArticuloChange}
                    placeholder="0"
                    className="w-full rounded-lg border border-[#333] bg-[#121212] px-4 py-2.5 text-sm text-[#e3e2e2] transition-all placeholder:text-[#555] focus:border-[#ffd700] focus:outline-none focus:ring-1 focus:ring-[#ffd700]/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-[#ffd700]/80">
                    Tipo / Categoría
                  </label>
                  <input
                    type="text"
                    name="tipo_articulo"
                    value={articuloForm.tipo_articulo}
                    onChange={handleArticuloChange}
                    placeholder="Ej: Bicicletas, Repuestos..."
                    className="w-full rounded-lg border border-[#333] bg-[#121212] px-4 py-2.5 text-sm text-[#e3e2e2] transition-all placeholder:text-[#555] focus:border-[#ffd700] focus:outline-none focus:ring-1 focus:ring-[#ffd700]/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-[#ffd700]/80">
                    Material
                  </label>
                  <input
                    type="text"
                    name="material"
                    value={articuloForm.material}
                    onChange={handleArticuloChange}
                    placeholder="Ej: Aluminio, Carbono..."
                    className="w-full rounded-lg border border-[#333] bg-[#121212] px-4 py-2.5 text-sm text-[#e3e2e2] transition-all placeholder:text-[#555] focus:border-[#ffd700] focus:outline-none focus:ring-1 focus:ring-[#ffd700]/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-[#ffd700]/80">
                    Color
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={articuloForm.color}
                    onChange={handleArticuloChange}
                    placeholder="Ej: Negro Mate"
                    className="w-full rounded-lg border border-[#333] bg-[#121212] px-4 py-2.5 text-sm text-[#e3e2e2] transition-all placeholder:text-[#555] focus:border-[#ffd700] focus:outline-none focus:ring-1 focus:ring-[#ffd700]/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-[#ffd700]/80">
                    Tamaño
                  </label>
                  <input
                    type="text"
                    name="tamano"
                    value={articuloForm.tamano}
                    onChange={handleArticuloChange}
                    placeholder="Ej: L, 56cm..."
                    className="w-full rounded-lg border border-[#333] bg-[#121212] px-4 py-2.5 text-sm text-[#e3e2e2] transition-all placeholder:text-[#555] focus:border-[#ffd700] focus:outline-none focus:ring-1 focus:ring-[#ffd700]/30"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-[#ffd700]/80">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion_articulo"
                    value={articuloForm.descripcion_articulo}
                    onChange={handleArticuloChange}
                    rows={2}
                    placeholder="Breve descripción del artículo..."
                    className="w-full resize-none rounded-lg border border-[#333] bg-[#121212] px-4 py-2.5 text-sm text-[#e3e2e2] transition-all placeholder:text-[#555] focus:border-[#ffd700] focus:outline-none focus:ring-1 focus:ring-[#ffd700]/30"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#ffd700]/10 pt-5">
                <button
                  type="button"
                  onClick={() => setShowArticuloModal(false)}
                  className="rounded-lg px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#d0c6ab] transition-all hover:bg-[#1a1a1a] hover:text-[#e3e2e2]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submittingArticulo}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#ffd700] to-[#e6c200] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-all hover:from-[#e6c200] hover:to-[#d4b000] disabled:opacity-50"
                >
                  {submittingArticulo && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  )}
                  {editingArticulo ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMovimientoModal && movementTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
          <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-[#1a1a1a] bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] shadow-2xl shadow-black/60">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] bg-[#121212] px-6 py-4">
              <div>
                <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${movementType === "Entrada" ? "text-[#4ADE80]" : "text-[#ffb4ab]"}`}>
                  {movementType} de Inventario
                </p>
                <h3 className="mt-1 text-xl font-bold text-[#e3e2e2]">{movementTarget.nombre_articulo}</h3>
              </div>
              <button
                onClick={() => setShowMovimientoModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#d0c6ab] transition-all hover:bg-[#ffd700]/10 hover:text-[#ffd700]"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleMovimientoSubmit} className="space-y-5 px-6 py-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-[#1a1a1a] bg-[#121212] p-4">
                  <p className="text-[10px] uppercase tracking-widest text-[#d0c6ab]">Artículo</p>
                  <p className="mt-1 font-bold text-[#e3e2e2]">{movementTarget.nombre_articulo}</p>
                </div>
                <div className="rounded-lg border border-[#1a1a1a] bg-[#121212] p-4">
                  <p className="text-[10px] uppercase tracking-widest text-[#d0c6ab]">Stock actual</p>
                  <p className="mt-1 text-xl font-bold text-[#e3e2e2]">{movementTarget.cantidad_articulo ?? 0} unidades</p>
                </div>
              </div>

              <div className="rounded-lg border border-[#1a1a1a] bg-[#121212] p-4">
                <p className="text-[10px] uppercase tracking-widest text-[#d0c6ab]">Tipo de movimiento</p>
                <p className={`mt-1 inline-flex rounded px-3 py-1 text-xs font-black uppercase tracking-widest ${movementType === "Entrada" ? "bg-[#4ADE80]/10 text-[#4ADE80]" : "bg-[#ffb4ab]/10 text-[#ffb4ab]"}`}>
                  {movementType}
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-[#ffd700]/80">
                  Cantidad a mover <span className="text-[#ffb4ab]">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  name="cantidad"
                  value={movementForm.cantidad}
                  onChange={handleMovimientoChange}
                  className={`w-full rounded-lg border bg-[#121212] px-4 py-2.5 text-sm text-[#e3e2e2] transition-all placeholder:text-[#555] focus:outline-none focus:ring-1 ${
                    movementError ? "border-[#ffb4ab] focus:border-[#ffb4ab] focus:ring-[#ffb4ab]/30" : "border-[#333] focus:border-[#ffd700] focus:ring-[#ffd700]/30"
                  }`}
                  placeholder="0"
                />
                {movementType === "Salida" && (
                  <p className="mt-2 text-[11px] text-[#d0c6ab]">
                    En salida no puede superar {movementTarget.cantidad_articulo ?? 0} unidades.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-[#ffd700]/80">
                  Razón <span className="text-[#ffb4ab]">*</span>
                </label>
                <select
                  name="razon"
                  value={movementForm.razon}
                  onChange={handleMovimientoChange}
                  className="w-full rounded-lg border border-[#333] bg-[#121212] px-4 py-2.5 text-sm text-[#e3e2e2] transition-all focus:border-[#ffd700] focus:outline-none focus:ring-1 focus:ring-[#ffd700]/30"
                >
                  {RAZONES.map((razon) => (
                    <option key={razon} value={razon} className="bg-black">
                      {razon}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-[#ffd700]/80">
                  Observaciones
                </label>
                <textarea
                  name="observaciones"
                  value={movementForm.observaciones}
                  onChange={handleMovimientoChange}
                  maxLength={200}
                  rows={3}
                  placeholder="Máximo 200 caracteres"
                  className="w-full resize-none rounded-lg border border-[#333] bg-[#121212] px-4 py-2.5 text-sm text-[#e3e2e2] transition-all placeholder:text-[#555] focus:border-[#ffd700] focus:outline-none focus:ring-1 focus:ring-[#ffd700]/30"
                />
              </div>

              {movementError && (
                <div className="rounded-lg border border-[#ffb4ab]/30 bg-[#ffb4ab]/10 px-4 py-3 text-sm text-[#ffb4ab]">
                  {movementError}
                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-[#1a1a1a] pt-5">
                <button
                  type="button"
                  onClick={() => setShowMovimientoModal(false)}
                  className="rounded-lg px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#d0c6ab] transition-all hover:bg-[#1a1a1a] hover:text-[#e3e2e2]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submittingMovimiento}
                  className="flex items-center gap-2 rounded-lg bg-[#ffd700] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-[#e6c200] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submittingMovimiento && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  )}
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventario;
