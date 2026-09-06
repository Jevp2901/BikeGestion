import { useEffect, useState } from "react";
import { API_V1_BASE_URL } from "../utils/sesion";
import LiquidacionNominaModal from "./LiquidacionNominaModal";

function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [activeTab, setActiveTab] = useState("colaboradores"); // 'colaboradores', 'liquidacion', 'historico', 'ventas'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [showEmpleadoModal, setShowEmpleadoModal] = useState(false);
  
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);
  
  // Formulario para registrar nuevo empleado
  const [empForm, setEmpForm] = useState({
    usuario_id: 1,
    numero_documento: "",
    fecha_nacimiento: "1995-01-01",
    genero: "MASCULINO",
    cargo: "Vendedor",
    tipo_contrato: "Término Indefinido",
    fecha_ingreso: new Date().toISOString().slice(0, 10),
    salario_base: 1420000,
    auxilio_transporte: 162000,
    bonificacion_fija: 100000,
    porcentaje_salud: 4,
    porcentaje_pension: 4,
    tiene_embargo: 0,
    valor_embargo: 0,
  });

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [resEmp, resPagos, resVentas, resUsers] = await Promise.all([
        fetch(`${API_V1_BASE_URL}/empleados/`),
        fetch(`${API_V1_BASE_URL}/pagos-empleado/`),
        fetch(`${API_V1_BASE_URL}/ventas/`),
        fetch(`${API_V1_BASE_URL}/usuarios/lista/`),
      ]);

      const dataEmp = await resEmp.json();
      const dataPagos = await resPagos.json();
      const dataVentas = await resVentas.json();
      const dataUsers = await resUsers.json();

      if (!resEmp.ok) throw new Error(dataEmp.error || "No se pudo cargar la lista de empleados.");
      if (!resPagos.ok) throw new Error(dataPagos.error || "No se pudo cargar el historial de pagos.");
      if (!resVentas.ok) throw new Error(dataVentas.error || "No se pudo cargar el historial de ventas.");

      setEmpleados(Array.isArray(dataEmp) ? dataEmp : []);
      setPagos(Array.isArray(dataPagos) ? dataPagos : []);
      setVentas(Array.isArray(dataVentas) ? dataVentas : []);
      setUsuariosDisponibles(Array.isArray(dataUsers) ? dataUsers : []);

      if (Array.isArray(dataUsers) && dataUsers.length > 0) {
        setEmpForm((prev) => ({
          ...prev,
          usuario_id: prev.usuario_id || dataUsers[0].id_usuario,
          numero_documento: prev.numero_documento || (dataUsers[0].numero_documento !== "Sin registrar" ? dataUsers[0].numero_documento : ""),
        }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatCOP = (val) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(val || 0);

  const vendedoresCount = empleados.filter((e) => e.cargo === "Vendedor").length;
  const mecanicosCount = empleados.filter((e) => e.cargo === "Mecanico").length;

  const totalPeriodo = empleados.reduce(
    (acc, curr) => acc + Number(curr.salario_base || 0) + Number(curr.auxilio_transporte || 0) + Number(curr.bonificacion_fija || 0),
    0
  );

  const pagosPendientes = pagos.filter((p) => p.estado_pago === "Pendiente");
  const pagosRealizados = pagos.filter((p) => p.estado_pago === "Pagado");

  const totalPendientes = pagosPendientes.reduce((acc, curr) => acc + Number(curr.total_pagar || 0), 0);
  const totalRealizados = pagosRealizados.reduce((acc, curr) => acc + Number(curr.total_pagar || 0), 0);

  const handleCreateEmpleado = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(`${API_V1_BASE_URL}/empleados/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(empForm),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No fue posible registrar el empleado.");
      setShowEmpleadoModal(false);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="mx-auto max-w-7xl space-y-6 text-[#e3e2e2]">
      
      {/* Subheader superior */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#ffd700]">
            MÓDULO DE GESTIÓN LABORAL Y NÓMINA
          </span>
          <h1 className="mt-1 text-3xl font-black uppercase italic tracking-tight text-[#e3e2e2]">
            EMPLEADOS Y NÓMINA
          </h1>
          <p className="mt-1 text-xs text-[#d0c6ab]">
            Control de contratos laborales, liquidación prestacional conforme a la ley colombiana e historial de ventas por colaborador.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="flex items-center gap-2 rounded-xl border border-[#333] bg-[#0d0e0f] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#d0c6ab] transition-colors hover:border-[#ffd700] hover:text-white"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Actualizar
          </button>
          <button
            onClick={() => setShowEmpleadoModal(true)}
            className="flex items-center gap-2 rounded-xl bg-[#ffd700] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black shadow-lg shadow-[#ffd700]/10 hover:bg-[#ffe16d]"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            + Registrar Empleado
          </button>
        </div>
      </div>

      {/* Pestañas Navegables por Estado (Tabs 1, 2, 3 y 4) */}
      <div className="flex flex-wrap border-b border-[#4d4732]">
        <button
          onClick={() => setActiveTab("colaboradores")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === "colaboradores"
              ? "border-[#ffd700] bg-[#ffd700]/10 text-[#ffd700]"
              : "border-transparent text-[#d0c6ab] hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-sm">badge</span>
          1. Colaboradores Activos
        </button>
        
        <button
          onClick={() => setActiveTab("liquidacion")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === "liquidacion"
              ? "border-[#ffd700] bg-[#ffd700]/10 text-[#ffd700]"
              : "border-transparent text-[#d0c6ab] hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-sm">payments</span>
          2. Liquidación y Pagos de Nómina ({pagosPendientes.length})
        </button>

        <button
          onClick={() => setActiveTab("historico")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === "historico"
              ? "border-[#ffd700] bg-[#ffd700]/10 text-[#ffd700]"
              : "border-transparent text-[#d0c6ab] hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-sm">history</span>
          3. Histórico de Pagos Realizados ({pagosRealizados.length})
        </button>

        <button
          onClick={() => setActiveTab("ventas")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === "ventas"
              ? "border-[#ffd700] bg-[#ffd700]/10 text-[#ffd700]"
              : "border-transparent text-[#d0c6ab] hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-sm">point_of_sale</span>
          4. Histórico de Ventas Realizadas y Rechazadas ({ventas.length})
        </button>
      </div>

      {error && <div className="rounded-xl border border-red-800 bg-red-950/40 p-4 text-xs text-red-300">{error}</div>}

      {/* Tarjetas de Métricas Principales */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-[#4d4732] bg-[#0d0e0f] p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#d0c6ab]">Total Colaboradores</span>
            <span className="material-symbols-outlined text-[#ffd700]">badge</span>
          </div>
          <p className="mt-2 text-3xl font-black font-mono text-white">{empleados.length}</p>
          <div className="mt-2 flex items-center gap-3 text-[11px] text-[#d0c6ab]">
            <span>• {vendedoresCount} Vendedores</span>
            <span>• {mecanicosCount} Mecánicos</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#4d4732] bg-[#0d0e0f] p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#d0c6ab]">Total Nómina Activa</span>
            <span className="material-symbols-outlined text-[#ffd700]">payments</span>
          </div>
          <p className="mt-2 text-2xl font-black font-mono text-[#ffd700]">{formatCOP(totalPeriodo)}</p>
          <p className="mt-2 text-[11px] text-[#d0c6ab]">Quincena activa - Septiembre 2026</p>
        </div>

        <div className="rounded-2xl border border-[#4d4732] bg-[#0d0e0f] p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#d0c6ab]">Pagos Pendientes</span>
            <span className="material-symbols-outlined text-amber-400">pending_actions</span>
          </div>
          <p className="mt-2 text-3xl font-black font-mono text-amber-400">{pagosPendientes.length}</p>
          <p className="mt-2 text-[11px] text-[#d0c6ab]">Por autorizar: {formatCOP(totalPendientes)}</p>
        </div>

        <div className="rounded-2xl border border-[#4d4732] bg-[#0d0e0f] p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#d0c6ab]">Pagos Realizados</span>
            <span className="material-symbols-outlined text-green-400">verified</span>
          </div>
          <p className="mt-2 text-3xl font-black font-mono text-green-400">{pagosRealizados.length}</p>
          <p className="mt-2 text-[11px] text-[#d0c6ab]">Total sellado: {formatCOP(totalRealizados)}</p>
        </div>
      </div>

      {/* RENDERIZADO DINÁMICO DE CONTENIDO SEGÚN TAB SELECCIONADO */}

      {/* Tab 1: Colaboradores Activos */}
      {activeTab === "colaboradores" && (
        <div className="overflow-hidden rounded-2xl border border-[#4d4732] bg-[#0a0a0a] shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1f1f1f] bg-[#121212] p-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#ffd700]">
              Directorio General de Colaboradores de Tienda
            </h2>
            <span className="text-[10px] text-[#d0c6ab]">Gestión Exclusiva de Administrador</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-[#d0c6ab]">Cargando colaboradores...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1f1f1f] bg-[#0d0e0f] uppercase tracking-widest text-[#ffd700]">
                    <th className="p-4">Documento</th>
                    <th className="p-4">Nombre y Apellidos</th>
                    <th className="p-4">Cargo Laboral</th>
                    <th className="p-4">Salario Base</th>
                    <th className="p-4">Devengados</th>
                    <th className="p-4">Deducciones</th>
                    <th className="p-4">Total Neto</th>
                    <th className="p-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f1f1f]">
                  {empleados.map((emp) => {
                    const devengados = Number(emp.salario_base || 0) + Number(emp.auxilio_transporte || 0) + Number(emp.bonificacion_fija || 0);
                    const deducciones = (Number(emp.salario_base || 0) * (Number(emp.porcentaje_salud || 4) + Number(emp.porcentaje_pension || 4))) / 100 + (emp.tiene_embargo ? Number(emp.valor_embargo || 0) : 0);
                    const totalNeto = devengados - deducciones;

                    return (
                      <tr key={emp.id_empleado} className="hover:bg-[#121212]">
                        <td className="p-4 font-mono font-bold text-[#d0c6ab]">CC {emp.numero_documento}</td>
                        <td className="p-4 font-semibold text-[#e3e2e2]">
                          {emp.nombre_usuario || `Empleado #${emp.id_empleado}`}
                          <div className="text-[10px] text-[#d0c6ab]">{emp.tipo_contrato || "Contrato Indefinido"}</div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 rounded-full border border-[#4d4732] bg-[#121212] px-2.5 py-0.5 text-[10px] font-bold text-[#ffd700]">
                            {emp.cargo}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-semibold text-[#e3e2e2]">{formatCOP(emp.salario_base)}</td>
                        <td className="p-4 font-mono text-[#ffd700]">{formatCOP(devengados)}</td>
                        <td className="p-4 font-mono text-red-400">-{formatCOP(deducciones)}</td>
                        <td className="p-4 font-mono font-black text-[#ffd700]">{formatCOP(totalNeto)}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedEmpleado(emp)}
                            className="rounded-lg bg-[#ffd700] px-3 py-1.5 text-[10px] font-black uppercase text-black hover:bg-[#ffe16d]"
                          >
                            LIQUIDAR
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Liquidación y Pagos de Nómina */}
      {activeTab === "liquidacion" && (
        <div className="overflow-hidden rounded-2xl border border-[#4d4732] bg-[#0a0a0a] shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1f1f1f] bg-[#121212] p-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Pagos Pendientes por Autorizar
            </h2>
            <span className="text-[10px] text-[#d0c6ab]">Peticiones en espera de firma del Administrador</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1f1f1f] bg-[#0d0e0f] uppercase tracking-widest text-[#ffd700]">
                  <th className="p-4">Colaborador / Documento</th>
                  <th className="p-4">Período Inicio</th>
                  <th className="p-4">Período Fin</th>
                  <th className="p-4">Total Devengado</th>
                  <th className="p-4">Deducciones</th>
                  <th className="p-4">Monto Neto a Pagar</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f1f]">
                {pagosPendientes.map((pago) => (
                  <tr key={pago.id_pago_empleado} className="hover:bg-[#121212]">
                    <td className="p-4 font-semibold text-[#e3e2e2]">
                      {pago.nombre_usuario || `Empleado #${pago.id_empleado}`}
                    </td>
                    <td className="p-4 font-mono text-[#d0c6ab]">{pago.periodo_inicio}</td>
                    <td className="p-4 font-mono text-[#d0c6ab]">{pago.periodo_fin}</td>
                    <td className="p-4 font-mono text-[#ffd700]">{formatCOP(pago.total_devengado)}</td>
                    <td className="p-4 font-mono text-red-400">-{formatCOP(pago.total_deducciones)}</td>
                    <td className="p-4 font-mono font-black text-[#ffd700]">{formatCOP(pago.total_pagar)}</td>
                    <td className="p-4">
                      <span className="rounded-full border border-amber-800 bg-amber-950/60 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
                        Pendiente
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          const emp = empleados.find((e) => e.id_empleado === pago.id_empleado) || { id_empleado: pago.id_empleado, numero_documento: pago.numero_documento, cargo: "Colaborador", salario_base: pago.total_devengado };
                          setSelectedEmpleado(emp);
                        }}
                        className="rounded-lg bg-[#ffd700] px-3 py-1.5 text-[10px] font-black uppercase text-black hover:bg-[#ffe16d]"
                      >
                        REVISAR Y SELLAR
                      </button>
                    </td>
                  </tr>
                ))}
                {pagosPendientes.length === 0 && (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-[#d0c6ab]">
                      No existen pagos pendientes por autorizar en el período actual.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Histórico de Pagos Realizados */}
      {activeTab === "historico" && (
        <div className="overflow-hidden rounded-2xl border border-[#4d4732] bg-[#0a0a0a] shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1f1f1f] bg-[#121212] p-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-green-400">
              Histórico de Pagos Inmutables Registrados
            </h2>
            <span className="text-[10px] text-[#d0c6ab]">Registros Sellados e Inmodificables</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1f1f1f] bg-[#0d0e0f] uppercase tracking-widest text-[#ffd700]">
                  <th className="p-4">Folio / ID</th>
                  <th className="p-4">Colaborador / Documento</th>
                  <th className="p-4">Período de Nómina</th>
                  <th className="p-4">Devengado</th>
                  <th className="p-4">Deducciones</th>
                  <th className="p-4">Total Pagado</th>
                  <th className="p-4">Estado Transaccional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f1f]">
                {pagosRealizados.map((pago) => (
                  <tr key={pago.id_pago_empleado} className="hover:bg-[#121212]">
                    <td className="p-4 font-mono text-[#d0c6ab]">PAGO-#{pago.id_pago_empleado}</td>
                    <td className="p-4 font-semibold text-[#e3e2e2]">
                      {pago.nombre_usuario || `Empleado #${pago.id_empleado}`}
                    </td>
                    <td className="p-4 font-mono text-[#d0c6ab]">
                      {pago.periodo_inicio} al {pago.periodo_fin}
                    </td>
                    <td className="p-4 font-mono text-[#ffd700]">{formatCOP(pago.total_devengado)}</td>
                    <td className="p-4 font-mono text-red-400">-{formatCOP(pago.total_deducciones)}</td>
                    <td className="p-4 font-mono font-black text-green-400">{formatCOP(pago.total_pagar)}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 rounded-full border border-green-800 bg-green-950/60 px-2.5 py-0.5 text-[10px] font-bold text-green-400">
                        <span className="material-symbols-outlined text-[12px]">lock</span>
                        PAGADO (INMUTABLE)
                      </span>
                    </td>
                  </tr>
                ))}
                {pagosRealizados.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-[#d0c6ab]">
                      No se han registrado pagos en estado Pagado aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Histórico de Ventas Realizadas y Devoluciones/Rechazadas */}
      {activeTab === "ventas" && (
        <div className="overflow-hidden rounded-2xl border border-[#4d4732] bg-[#0a0a0a] shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1f1f1f] bg-[#121212] p-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#ffd700]">
              Histórico de Ventas Realizadas y Devoluciones por Vendedor
            </h2>
            <span className="text-[10px] text-[#d0c6ab]">Seguimiento de Desempeño Comercial</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1f1f1f] bg-[#0d0e0f] uppercase tracking-widest text-[#ffd700]">
                  <th className="p-4">Folio Venta</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Vendedor / Colaborador</th>
                  <th className="p-4">Cliente Registrado</th>
                  <th className="p-4">Método de Pago</th>
                  <th className="p-4">Monto Total</th>
                  <th className="p-4">Estado Operativo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f1f]">
                {ventas.map((venta) => {
                  const totalVenta = venta.recibo?.total || venta.total || (venta.detalles || []).reduce((acc, d) => acc + Number(d.total_venta || 0), 0);
                  const esDevuelta = venta.estado_venta === "Devuelta";

                  return (
                    <tr key={venta.id_venta} className="hover:bg-[#121212]">
                      <td className="p-4 font-mono font-bold text-[#ffd700]">VT-#{venta.id_venta}</td>
                      <td className="p-4 font-mono text-[#d0c6ab]">{venta.fecha_venta}</td>
                      <td className="p-4 font-semibold text-[#e3e2e2]">
                        {venta.nombre_usuario || `Vendedor #${venta.id_usuario}`}
                      </td>
                      <td className="p-4 text-[#d0c6ab]">{venta.nombre_cliente || "Cliente General"}</td>
                      <td className="p-4 text-[#e3e2e2]">{venta.metodo_pago || "Efectivo"}</td>
                      <td className="p-4 font-mono font-black text-white">{formatCOP(totalVenta)}</td>
                      <td className="p-4">
                        {esDevuelta ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-red-800 bg-red-950/60 px-2.5 py-0.5 text-[10px] font-bold text-red-400">
                            Devuelta / Revertido
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-green-800 bg-green-950/60 px-2.5 py-0.5 text-[10px] font-bold text-green-400">
                            Realizada
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {ventas.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-[#d0c6ab]">
                      No hay registros de ventas para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Algoritmo de Liquidación en footer */}
      <div className="rounded-2xl border border-[#4d4732] bg-[#0d0e0f] p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
          <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ffd700]">
            <span className="material-symbols-outlined text-sm">functions</span>
            Algoritmo de Liquidación y Reglas de Nómina
          </span>
          <span className="rounded-lg border border-[#333] bg-[#121212] px-3 py-1 text-[10px] text-[#d0c6ab]">
            Norma Laboral Vigente
          </span>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] p-4">
            <span className="text-xs font-bold uppercase text-[#ffd700] flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">add_circle</span>
              TOTAL DEVENGADO
            </span>
            <div className="mt-2 rounded bg-[#121212] p-2 font-mono text-xs text-[#ffd700]">
              Devengado = Salario Base + Auxilio de Transporte + Bonificación Fija
            </div>
            <p className="mt-2 text-[11px] text-[#d0c6ab]">
              Aplica auxilio de transporte para salarios de hasta 2 salarios mínimos legales vigentes. Las bonificaciones fijas forman base salarial.
            </p>
          </div>

          <div className="rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] p-4">
            <span className="text-xs font-bold uppercase text-red-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">do_not_disturb_on</span>
              TOTAL DEDUCCIONES
            </span>
            <div className="mt-2 rounded bg-[#121212] p-2 font-mono text-xs text-red-400">
              Deducciones = (4% Salud + 4% Pensión) + Embargos Judiciales
            </div>
            <p className="mt-2 text-[11px] text-[#d0c6ab]">
              Aportes de ley a seguridad social a cargo del trabajador más retenciones por embargo de alimentos autorizadas.
            </p>
          </div>

          <div className="rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] p-4">
            <span className="text-xs font-bold uppercase text-green-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              NETO A PAGAR E INMUTABILIDAD
            </span>
            <div className="mt-2 rounded bg-[#121212] p-2 font-mono text-xs text-green-400">
              Total Neto = Total Devengado - Total Deducciones
            </div>
            <p className="mt-2 text-[11px] text-[#d0c6ab]">
              Una vez efectuado el registro de pago en el sistema, este se sella permanentemente y no admite cambios posteriores.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Liquidación Individual */}
      {selectedEmpleado && (
        <LiquidacionNominaModal
          empleado={selectedEmpleado}
          onClose={() => setSelectedEmpleado(null)}
          onSuccess={() => {
            setSelectedEmpleado(null);
            loadData();
          }}
        />
      )}

      {/* Modal Registrar Nuevo Empleado */}
      {showEmpleadoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleCreateEmpleado}
            className="w-full max-w-2xl rounded-2xl border border-[#4d4732] bg-[#0d0e0f] p-6 text-[#e3e2e2] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#ffd700]">Vinculación de Personal</span>
                <h2 className="text-lg font-black uppercase text-white">Registrar Nuevo Empleado</h2>
              </div>
              <button type="button" onClick={() => setShowEmpleadoModal(false)} className="text-xs text-[#d0c6ab] hover:text-white">✕</button>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 text-xs">
              <label className="md:col-span-2">
                <span className="font-bold text-[#d0c6ab]">Usuario Registrado en el Sistema *</span>
                {usuariosDisponibles.length > 0 ? (
                  <select
                    required
                    value={empForm.usuario_id}
                    onChange={(e) => {
                      const uid = Number(e.target.value);
                      const selectedUser = usuariosDisponibles.find((u) => u.id_usuario === uid);
                      setEmpForm({
                        ...empForm,
                        usuario_id: uid,
                        numero_documento:
                          selectedUser?.numero_documento && selectedUser.numero_documento !== "Sin registrar"
                            ? selectedUser.numero_documento
                            : empForm.numero_documento,
                      });
                    }}
                    className="mt-1 w-full rounded-lg border border-[#333] bg-[#080808] p-2.5 text-white outline-none focus:border-[#ffd700]"
                  >
                    <option value="">-- Seleccionar Usuario Registrado --</option>
                    {usuariosDisponibles.map((u) => (
                      <option key={u.id_usuario} value={u.id_usuario}>
                        #{u.id_usuario} - {u.nombre_usuario} ({u.correo}) - Doc: {u.numero_documento}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    required
                    value={empForm.usuario_id}
                    onChange={(e) => setEmpForm({ ...empForm, usuario_id: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-[#333] bg-[#080808] p-2.5 text-white outline-none focus:border-[#ffd700]"
                  />
                )}
              </label>

              <label>
                <span className="font-bold text-[#d0c6ab]">Número de Cédula / Documento *</span>
                <input
                  type="text"
                  required
                  placeholder="Ej. 1018459201"
                  value={empForm.numero_documento}
                  onChange={(e) => setEmpForm({ ...empForm, numero_documento: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#333] bg-[#080808] p-2.5 text-white outline-none focus:border-[#ffd700]"
                />
              </label>

              <label>
                <span className="font-bold text-[#d0c6ab]">Cargo Laboral *</span>
                <select
                  value={empForm.cargo}
                  onChange={(e) => setEmpForm({ ...empForm, cargo: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#333] bg-[#080808] p-2.5 text-white outline-none focus:border-[#ffd700]"
                >
                  <option value="Vendedor">Vendedor</option>
                  <option value="Mecanico">Mecanico</option>
                </select>
              </label>

              <label>
                <span className="font-bold text-[#d0c6ab]">Salario Base Mensual ($ COP) *</span>
                <input
                  type="number"
                  required
                  value={empForm.salario_base}
                  onChange={(e) => setEmpForm({ ...empForm, salario_base: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-[#333] bg-[#080808] p-2.5 text-white outline-none focus:border-[#ffd700]"
                />
              </label>

              <label>
                <span className="font-bold text-[#d0c6ab]">Auxilio de Transporte ($ COP)</span>
                <input
                  type="number"
                  value={empForm.auxilio_transporte}
                  onChange={(e) => setEmpForm({ ...empForm, auxilio_transporte: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-[#333] bg-[#080808] p-2.5 text-white outline-none focus:border-[#ffd700]"
                />
              </label>

              <label>
                <span className="font-bold text-[#d0c6ab]">Bonificación Fija ($ COP)</span>
                <input
                  type="number"
                  value={empForm.bonificacion_fija}
                  onChange={(e) => setEmpForm({ ...empForm, bonificacion_fija: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-[#333] bg-[#080808] p-2.5 text-white outline-none focus:border-[#ffd700]"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-[#1f1f1f] pt-4">
              <button
                type="button"
                onClick={() => setShowEmpleadoModal(false)}
                className="rounded-lg border border-[#333] px-4 py-2 text-xs font-bold text-[#d0c6ab] hover:border-[#ffd700]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#ffd700] px-5 py-2 text-xs font-black uppercase text-black hover:bg-[#ffe16d]"
              >
                Guardar Empleado
              </button>
            </div>
          </form>
        </div>
      )}

    </section>
  );
}

export default Empleados;
