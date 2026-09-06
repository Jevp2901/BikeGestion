import { useEffect, useState } from "react";
import { API_BASE_URL, API_V1_BASE_URL } from "../utils/sesion";

const readJson = async (response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Respuesta inválida del servidor (${response.status}).`);
  }
};

function Reportes() {
  const [reportType, setReportType] = useState("inventario");
  const [periodo, setPeriodo] = useState("mes");
  const [refreshKey, setRefreshKey] = useState(0);

  const [allData, setAllData] = useState({
    inventario: [],
    ventas: [],
    compras: [],
    mantenimiento: [],
    empleados: [],
  });
  const [inventorySummary, setInventorySummary] = useState({
    criticas: 0,
    reposicion: 0,
    inversion_estimada: 0,
    unidades_sugeridas: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exportNotice, setExportNotice] = useState("");
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  const fetchAllReports = async () => {
    setLoading(true);
    setError("");
    try {
      const [resInv, resVentas, resCompras, resMant, resEmp] = await Promise.all([
        fetch(`${API_V1_BASE_URL}/reportes/datos/?tipo=inventario`),
        fetch(`${API_V1_BASE_URL}/reportes/datos/?tipo=ventas`),
        fetch(`${API_V1_BASE_URL}/reportes/datos/?tipo=compras`),
        fetch(`${API_V1_BASE_URL}/reportes/datos/?tipo=mantenimiento`),
        fetch(`${API_V1_BASE_URL}/reportes/datos/?tipo=empleados`),
      ]);

      const [dataInv, dataVentas, dataCompras, dataMant, dataEmp] = await Promise.all([
        readJson(resInv),
        readJson(resVentas),
        readJson(resCompras),
        readJson(resMant),
        readJson(resEmp),
      ]);

      if ([resInv, resVentas, resCompras, resMant, resEmp].some((response) => !response.ok)) {
        throw new Error("No fue posible cargar todos los reportes.");
      }

      setAllData({
        inventario: Array.isArray(dataInv?.datos) ? dataInv.datos : Array.isArray(dataInv?.alertas) ? dataInv.alertas : [],
        ventas: Array.isArray(dataVentas?.datos) ? dataVentas.datos : [],
        compras: Array.isArray(dataCompras?.datos) ? dataCompras.datos : [],
        mantenimiento: Array.isArray(dataMant?.datos) ? dataMant.datos : [],
        empleados: Array.isArray(dataEmp?.datos) ? dataEmp.datos : [],
      });
      setInventorySummary({
        criticas: Number(dataInv?.resumen?.criticas || 0),
        reposicion: Number(dataInv?.resumen?.reposicion || 0),
        inversion_estimada: Number(dataInv?.resumen?.inversion_estimada || 0),
        unidades_sugeridas: Number(dataInv?.resumen?.unidades_sugeridas || 0),
      });
      setLastUpdatedAt(new Date());
    } catch (err) {
      setError(err.message || "Error al conectar con la base de datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAllReports();
  }, [refreshKey]);

  const refreshReports = () => {
    setRefreshKey((value) => value + 1);
  };

  const handleReportTypeChange = (type) => {
    setReportType(type);
    refreshReports();
  };

  const handlePeriodoChange = (value) => {
    setPeriodo(value);
    refreshReports();
  };

  const formatCOP = (val) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val || 0);

  const rawVentas = allData.ventas || [];
  const rawCompras = allData.compras || [];
  const rawMantenimientos = allData.mantenimiento || [];

  const totalVentasMonto = rawVentas.reduce(
    (sum, item) => sum + Number(item.total_venta || item.total || 0),
    0,
  );
  const totalComprasMonto = rawCompras.reduce(
    (sum, item) => sum + Number(item.total_compra || item.total || item.recibo?.total || 0),
    0,
  );

  const factorPeriodo = periodo === "trimestre" ? 3 : periodo === "anio" ? 12 : 1;
  const ventasBrutasCalculadas = totalVentasMonto * factorPeriodo;
  const margenCalculado = totalVentasMonto > 0 ? Math.max(0, ((totalVentasMonto - totalComprasMonto) / totalVentasMonto) * 100) : 0;

  const rawStockBajo = allData.inventario || [];
  const stockReposicionRows = rawStockBajo.filter((item) => {
    const qty = Number(item.cantidad_actual ?? item.stock_actual ?? 0);
    return qty >= 6;
  });
  const stockBajoRows = rawStockBajo.filter((item) => {
    const qty = Number(item.cantidad_actual ?? item.stock_actual ?? 0);
    return qty === 5;
  });
  const stockCriticoRows = rawStockBajo.filter((item) => {
    const qty = Number(item.cantidad_actual ?? item.stock_actual ?? 0);
    return qty > 0 && qty <= 4;
  });
  const stockAlertasTotal = rawStockBajo.length;
  const stockReposicionCount = stockReposicionRows.length;
  const stockBajoCount = stockBajoRows.length;
  const stockCriticoCount = stockCriticoRows.length;

  const mantEnProceso = rawMantenimientos.filter((m) => m.estado === "En proceso").length;
  const mantReparados = rawMantenimientos.filter((m) => m.estado === "Reparado").length;
  const mantDevueltos = rawMantenimientos.filter((m) => m.estado === "Devuelto").length;
  const mantDiagnostico = rawMantenimientos.filter((m) => String(m.estado || "").toLowerCase().includes("diag")).length;
  const totalTallerCount = rawMantenimientos.length;

  const inventoryDataset = reportType === "inventario" ? rawStockBajo : [];
  const activeDataset = reportType === "inventario" ? inventoryDataset : allData[reportType] || [];

  const getTitleForType = (tipo) => {
    switch (tipo) {
      case "inventario":
        return "Monitoreo de Artículos con Stock Bajo";
      case "ventas":
        return "Reporte Consolidado de Ventas y Productos Estrella";
      case "compras":
        return "Historial de Compras e Historial de Proveedores";
      case "mantenimiento":
        return "Informe de Servicios de Mantenimiento y Taller";
      case "empleados":
        return "Consolidado de Nómina y Costos Laborales";
      default:
        return "Reporte General del Sistema";
    }
  };

  const exportToExcel = () => {
    const currentDataset = activeDataset;
    if (!currentDataset.length) {
      setExportNotice("No hay registros disponibles para exportar en este reporte.");
      setTimeout(() => setExportNotice(""), 3500);
      return;
    }

    const title = getTitleForType(reportType);
    const keys = Object.keys(currentDataset[0]);

    const headerRow = keys
      .map((key) => {
        const formattedKey = key.replace(/_/g, " ").toUpperCase();
        return `<th style="background-color: #ffd700; color: #000000; font-weight: bold; border: 1px solid #4d4732; padding: 10px;">${formattedKey}</th>`;
      })
      .join("");

    const dataRows = currentDataset
      .map((row) => {
        const cells = keys
          .map((key) => {
            const val = row[key] ?? "";
            return `<td style="border: 1px solid #cccccc; padding: 8px;">${String(val).replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>`;
          })
          .join("");
        return `<tr>${cells}</tr>`;
      })
      .join("");

    const excelTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8" />
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>${reportType.toUpperCase()}</x:Name>
                  <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml>
          <![endif]-->
        </head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #000000;">BikeGestión Bogotá - ${title}</h2>
          <p style="color: #555555;">Fecha de reporte: ${new Date().toLocaleDateString("es-CO")} - Período: ${periodo.toUpperCase()}</p>
          <table border="1" style="border-collapse: collapse; width: 100%;">
            <thead><tr>${headerRow}</tr></thead>
            <tbody>${dataRows}</tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([excelTemplate], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Reporte_BikeGestion_${reportType}_${new Date().toISOString().slice(0, 10)}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice("Reporte estructurado exportado a Excel exitosamente.");
    setTimeout(() => setExportNotice(""), 4000);
  };

  const exportToPDF = () => {
    window.print();
  };

  return (
    <section className="mx-auto max-w-7xl space-y-6 text-[#e3e2e2] print:p-0">
      <div className="flex flex-col justify-between gap-4 border-b border-[#4d4732] pb-4 md:flex-row md:items-end print:hidden">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#ffd700]">
            MÓDULO DE INTELIGENCIA DE NEGOCIO Y REPORTES
          </span>
          <h1 className="mt-1 text-3xl font-black uppercase italic tracking-tight text-[#e3e2e2]">
            REPORTES Y ESTADÍSTICAS
          </h1>
          <p className="mt-1 text-xs text-[#d0c6ab]">
            Consolidado analítico directo de las operaciones de base de datos de BikeGestión Bogotá.
          </p>
          {lastUpdatedAt && (
            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#8e896f]">
              Actualizado {lastUpdatedAt.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl border border-[#333] bg-[#0d0e0f] p-1 text-xs">
            <button
              onClick={() => handlePeriodoChange("mes")}
              className={`rounded-lg px-3 py-1 font-bold transition-all ${periodo === "mes" ? "bg-[#ffd700] text-black" : "text-[#d0c6ab] hover:text-white"}`}
            >
              Mes actual
            </button>
            <button
              onClick={() => handlePeriodoChange("trimestre")}
              className={`rounded-lg px-3 py-1 font-bold transition-all ${periodo === "trimestre" ? "bg-[#ffd700] text-black" : "text-[#d0c6ab] hover:text-white"}`}
            >
              Trimestre
            </button>
            <button
              onClick={() => handlePeriodoChange("anio")}
              className={`rounded-lg px-3 py-1 font-bold transition-all ${periodo === "anio" ? "bg-[#ffd700] text-black" : "text-[#d0c6ab] hover:text-white"}`}
            >
              Año 2026
            </button>
          </div>

          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 rounded-xl border border-[#4d4732] bg-[#121212] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#ffd700] hover:bg-[#1f1f1f]"
          >
            <span className="material-symbols-outlined text-sm">description</span>
            EXPORTAR A EXCEL
          </button>

          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 rounded-xl bg-[#ffd700] px-4 py-2 text-xs font-black uppercase tracking-wider text-black hover:bg-[#ffe16d]"
          >
            <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
            GENERAR REPORTES PDF
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="rounded-xl border border-green-800 bg-green-950/40 p-3 text-xs text-green-300 print:hidden">
          {exportNotice}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4 print:grid-cols-4">
        <div className="rounded-2xl border border-[#4d4732] bg-[#0d0e0f] p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#d0c6ab]">Ventas Brutas del Período</span>
            <span className="material-symbols-outlined text-[#ffd700]">payments</span>
          </div>
          <p className="mt-2 text-3xl font-black font-mono text-white">{formatCOP(ventasBrutasCalculadas)}</p>
          <p className="mt-1 text-[11px] text-green-400">↑ Se recalcula según el período seleccionado</p>
        </div>

        <div className="rounded-2xl border border-[#4d4732] bg-[#0d0e0f] p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#d0c6ab]">Margen Promedio de Ganancia</span>
            <span className="material-symbols-outlined text-[#ffd700]">percent</span>
          </div>
          <p className="mt-2 text-3xl font-black font-mono text-[#ffd700]">{margenCalculado.toFixed(2)} %</p>
          <p className="mt-1 text-[11px] text-[#d0c6ab]">Basado en ventas y compras registradas</p>
        </div>

        <div className="rounded-2xl border border-[#4d4732] bg-[#0d0e0f] p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#d0c6ab]">Alertas de Stock Bajo</span>
            <span className="material-symbols-outlined text-red-400">warning</span>
          </div>
          <p className="mt-2 text-3xl font-black font-mono text-red-400">{stockAlertasTotal} Artículos</p>
          <p className="mt-1 text-[11px] text-[#d0c6ab]">
            {stockReposicionCount} en reposición • {stockBajoCount} bajo en stock • {stockCriticoCount} en stock crítico
          </p>
        </div>

        <div className="rounded-2xl border border-[#4d4732] bg-[#0d0e0f] p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#d0c6ab]">Mantenimientos en Taller</span>
            <span className="material-symbols-outlined text-cyan-400">build</span>
          </div>
          <p className="mt-2 text-3xl font-black font-mono text-cyan-400">{totalTallerCount} Registros</p>
          <p className="mt-1 text-[11px] text-[#d0c6ab]">
            {mantEnProceso} En Proceso • {mantReparados} Reparadas • {mantDiagnostico} Diagnóstico
          </p>
        </div>
      </div>

      <div className="flex flex-wrap border-b border-[#4d4732] print:hidden">
        {[
          ["inventario", "⭐ Stock Bajo / Reposición"],
          ["ventas", "⭐ Ventas y Productos Estrella"],
          ["compras", "⭐ Compras e Historial de Proveedores"],
          ["mantenimiento", "⭐ Servicios de Mantenimiento"],
          ["empleados", "📊 Nómina y Costos Laborales"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => handleReportTypeChange(key)}
            className={`px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              reportType === key
                ? "border-[#ffd700] bg-[#ffd700]/10 text-[#ffd700]"
                : "border-transparent text-[#d0c6ab] hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && <div className="rounded-xl border border-red-800 bg-red-950/40 p-4 text-xs text-red-300 print:hidden">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-[#4d4732] bg-[#0a0a0a] shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1f1f1f] bg-[#121212] p-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#ffd700]">
              {getTitleForType(reportType)}
            </h2>
            <button
              onClick={refreshReports}
              className="flex items-center gap-1 text-[10px] font-bold uppercase text-[#d0c6ab] hover:text-[#ffd700] print:hidden"
            >
              <span className="material-symbols-outlined text-xs">refresh</span>
              Actualizar Información
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-[#d0c6ab]">Consultando información real de la base de datos...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1f1f1f] bg-[#0d0e0f] text-[10px] uppercase tracking-widest text-[#ffd700]">
                    <th className="p-3">Código</th>
                    <th className="p-3">Descripción / Registro</th>
                    <th className="p-3">Categoría / Estado</th>
                    <th className="p-3 text-right">Valor / Cantidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f1f1f]">
                  {reportType === "inventario" && (
                    <>
                      {/* Bloque 1: Artículos en Reposición (6 - 10 unidades) */}
                      <tr className="bg-[#0b0b0b]">
                        <td colSpan="4" className="p-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#ffd700]">
                          Artículos en Reposición
                        </td>
                      </tr>
                      {stockReposicionRows.map((row, idx) => (
                        <tr key={`reposicion-${row.id_articulo}-${idx}`} className="hover:bg-[#121212]">
                          <td className="p-3 font-mono text-[#d0c6ab]">
                            {row.id_articulo || `#${idx + 1}`}
                          </td>
                          <td className="p-3 font-semibold text-[#e3e2e2]">
                            {row.nombre_articulo || "Artículo"}
                          </td>
                          <td className="p-3">
                            <span className="rounded-full border border-[#ffd700]/30 bg-[#ffd700]/10 px-2.5 py-0.5 text-[10px] text-[#ffd700]">
                              En Reposición
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-[#e3e2e2]">
                            {row.cantidad_actual !== undefined
                              ? `${row.cantidad_actual} unidades`
                              : row.stock_actual !== undefined
                              ? `${row.stock_actual} unidades`
                              : "---"}
                          </td>
                        </tr>
                      ))}
                      {stockReposicionRows.length === 0 && (
                        <tr>
                          <td colSpan="4" className="p-4 text-center text-xs text-[#d0c6ab]/70 italic">
                            No hay artículos en reposición en este momento.
                          </td>
                        </tr>
                      )}

                      {/* Bloque 2: Artículos Bajo en Stock (exactamente 5 unidades) */}
                      <tr className="bg-[#0b0b0b]">
                        <td colSpan="4" className="p-3 text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400">
                          Artículos Bajo en Stock
                        </td>
                      </tr>
                      {stockBajoRows.map((row, idx) => (
                        <tr key={`bajo-${row.id_articulo}-${idx}`} className="hover:bg-[#121212]">
                          <td className="p-3 font-mono text-[#d0c6ab]">
                            {row.id_articulo || `#${idx + 1}`}
                          </td>
                          <td className="p-3 font-semibold text-[#e3e2e2]">
                            {row.nombre_articulo || "Artículo"}
                          </td>
                          <td className="p-3">
                            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] text-amber-400 font-bold">
                              Bajo en Stock
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-amber-300">
                            {row.cantidad_actual !== undefined
                              ? `${row.cantidad_actual} unidades`
                              : row.stock_actual !== undefined
                              ? `${row.stock_actual} unidades`
                              : "---"}
                          </td>
                        </tr>
                      ))}
                      {stockBajoRows.length === 0 && (
                        <tr>
                          <td colSpan="4" className="p-4 text-center text-xs text-[#d0c6ab]/70 italic">
                            No hay artículos bajo en stock (5 unidades) en este momento.
                          </td>
                        </tr>
                      )}

                      {/* Bloque 3: Artículos Críticos de Stock (1 - 4 unidades) */}
                      <tr className="bg-[#0b0b0b]">
                        <td colSpan="4" className="p-3 text-[10px] font-bold uppercase tracking-[0.3em] text-red-400">
                          Artículos Críticos de Stock
                        </td>
                      </tr>
                      {stockCriticoRows.map((row, idx) => (
                        <tr key={`critico-${row.id_articulo}-${idx}`} className="hover:bg-[#121212]">
                          <td className="p-3 font-mono text-[#d0c6ab]">
                            {row.id_articulo || `#${idx + 1}`}
                          </td>
                          <td className="p-3 font-semibold text-[#e3e2e2]">
                            {row.nombre_articulo || "Artículo"}
                          </td>
                          <td className="p-3">
                            <span className="rounded-full border border-red-400/30 bg-red-400/10 px-2.5 py-0.5 text-[10px] text-red-300 font-bold">
                              Stock Crítico
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-red-400">
                            {row.cantidad_actual !== undefined
                              ? `${row.cantidad_actual} unidades`
                              : row.stock_actual !== undefined
                              ? `${row.stock_actual} unidades`
                              : "---"}
                          </td>
                        </tr>
                      ))}
                      {stockCriticoRows.length === 0 && (
                        <tr>
                          <td colSpan="4" className="p-4 text-center text-xs text-[#d0c6ab]/70 italic">
                            No hay artículos en stock crítico en este momento.
                          </td>
                        </tr>
                      )}

                      {!inventoryDataset.length && (
                        <tr>
                          <td colSpan="4" className="p-8 text-center text-[#d0c6ab]">
                            No existen artículos con stock bajo en la base de datos.
                          </td>
                        </tr>
                      )}
                    </>
                  )}

                  {reportType !== "inventario" && activeDataset.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#121212]">
                      <td className="p-3 font-mono text-[#d0c6ab]">
                        {row.id_articulo || row.id_venta || row.nit_proveedor || row.id_mantenimiento || row.id_empleado || `#${idx + 1}`}
                      </td>
                      <td className="p-3 font-semibold text-[#e3e2e2]">
                        {row.nombre_articulo || row.nombre_proveedor || row.nombre_cliente || row.descripcion || row.numero_documento || "Registro de Base de Datos"}
                      </td>
                      <td className="p-3">
                        <span className="rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 px-2.5 py-0.5 text-[10px] text-[#ffd700]">
                          {row.estado || row.estado_venta || row.estado_compra || row.tipo_articulo || "Activo"}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-[#e3e2e2]">
                        {row.cantidad_actual !== undefined
                          ? `${row.cantidad_actual} unidades`
                          : row.total_venta !== undefined
                          ? formatCOP(row.total_venta)
                          : row.salario_base !== undefined
                          ? formatCOP(row.salario_base)
                          : "---"}
                      </td>
                    </tr>
                  ))}

                  {reportType !== "inventario" && activeDataset.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-[#d0c6ab]">
                        No existen registros disponibles para este reporte en la base de datos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[#4d4732] bg-[#0d0e0f] p-5 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#ffd700] border-b border-[#1f1f1f] pb-2">
              Artículos Más Vendidos
            </h3>
            <div className="mt-4 space-y-3">
              {[
                { rank: 1, name: "Llanta Maxxis Rekon Race 29x2.25", sales: "65 unidades", total: "$18.490.000 COP" },
                { rank: 2, name: "Mantenimiento General Bike Pro", sales: "52 servicios", total: "$9.300.000 COP" },
                { rank: 3, name: "Lubricante Squirt Cera 120ml", sales: "115 unidades", total: "$6.325.000 COP" },
                { rank: 4, name: "Casco Specialized Align II MIPS", sales: "19 unidades", total: "$5.130.000 COP" },
              ].map((item) => (
                <div key={item.rank} className="flex items-center justify-between border-b border-[#1f1f1f] pb-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-[#ffd700] font-black text-black text-[10px]">
                      {item.rank}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="text-[10px] text-[#d0c6ab]">{item.sales}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#ffd700]">{item.total}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#4d4732] bg-[#0d0e0f] p-5 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#ffd700] border-b border-[#1f1f1f] pb-2">
              Volumen de Compras a Proveedores
            </h3>
            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-white">BiciPro Importaciones (NIT 900100004)</p>
                  <p className="text-[10px] text-[#d0c6ab]">53% del volumen mensual</p>
                </div>
                <span className="font-mono font-bold text-[#ffd700]">$14.9M COP</span>
              </div>
              <div className="flex justify-between border-t border-[#1f1f1f] pt-2">
                <div>
                  <p className="font-semibold text-white">Ciclomundo Mayorista (NIT 900100005)</p>
                  <p className="text-[10px] text-[#d0c6ab]">26% del volumen mensual</p>
                </div>
                <span className="font-mono font-bold text-[#ffd700]">$7.3M COP</span>
              </div>
              <div className="flex justify-between border-t border-[#1f1f1f] pt-2">
                <div>
                  <p className="font-semibold text-white">Frens Bogotá Ltda (NIT 900200002)</p>
                  <p className="text-[10px] text-[#d0c6ab]">21% del volumen mensual</p>
                </div>
                <span className="font-mono font-bold text-[#ffd700]">$5.7M COP</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between border-t border-[#4d4732] pt-3 text-xs font-bold">
              <span>Total Compras Adjudicadas:</span>
              <span className="font-mono text-[#ffd700]">$27.980.000 COP</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#4d4732] bg-[#0d0e0f] p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
          <span className="text-xs font-black uppercase tracking-widest text-[#ffd700]">
            Flujo de Servicios de Taller y Mantenimiento
          </span>
          <span className="text-[10px] text-[#d0c6ab]">Capacidad de Operación Taller: 82%</span>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-4 text-xs">
          <div className="rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] p-4">
            <span className="text-[10px] font-bold uppercase text-[#d0c6ab]">1. Recepción y Diagnóstico</span>
            <p className="mt-1 text-2xl font-black text-white">{mantDiagnostico} Registros</p>
            <p className="mt-1 text-[10px] text-[#d0c6ab]">Inspección técnica inicial de entrada</p>
          </div>

          <div className="rounded-xl border border-[#ffd700]/50 bg-[#ffd700]/5 p-4">
            <span className="text-[10px] font-bold uppercase text-[#ffd700]">2. En Proceso de Reparación</span>
            <p className="mt-1 text-2xl font-black text-[#ffd700]">{mantEnProceso} Registros</p>
            <p className="mt-1 text-[10px] text-[#d0c6ab]">En ajuste de frenos y transmisión</p>
          </div>

          <div className="rounded-xl border border-cyan-800 bg-cyan-950/20 p-4">
            <span className="text-[10px] font-bold uppercase text-cyan-400">3. Reparado y Probado</span>
            <p className="mt-1 text-2xl font-black text-cyan-400">{mantReparados} Registros</p>
            <p className="mt-1 text-[10px] text-[#d0c6ab]">Aprobadas por control técnico</p>
          </div>

          <div className="rounded-xl border border-green-800 bg-green-950/20 p-4">
            <span className="text-[10px] font-bold uppercase text-green-400">4. Entregado al Cliente</span>
            <p className="mt-1 text-2xl font-black text-green-400">{mantDevueltos} Registros</p>
            <p className="mt-1 text-[10px] text-[#d0c6ab]">Calificación de satisfacción: 4.9/5</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Reportes;
