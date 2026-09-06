import { useState } from "react";
import { API_V1_BASE_URL } from "../utils/sesion";

function LiquidacionNominaModal({ empleado, onClose, onSuccess }) {
  const [periodoInicio, setPeriodoInicio] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10)
  );
  const [periodoFin, setPeriodoFin] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().slice(0, 10)
  );
  const [metodoPago, setMetodoPago] = useState("Transferencia Bancolombia Cta Ahorros #902-4412-88");
  const [referencia, setReferencia] = useState(`TX-${Date.now().toString().slice(-8)}`);
  const [observaciones, setObservaciones] = useState("Liquidación ordinaria de nómina aprobada por jefatura.");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!empleado) return null;

  const salarioBase = Number(empleado.salario_base || 0);
  const auxilioTransporte = Number(empleado.auxilio_transporte || 0);
  const bonificacionFija = Number(empleado.bonificacion_fija || 0);
  const pctSalud = Number(empleado.porcentaje_salud || 4);
  const pctPension = Number(empleado.porcentaje_pension || 4);
  const tieneEmbargo = Boolean(empleado.tiene_embargo);
  const valorEmbargo = tieneEmbargo ? Number(empleado.valor_embargo || 0) : 0;

  // Procesos matematicos de nomina (Ley laboral colombiana)
  const devengadoTotal = salarioBase + auxilioTransporte + bonificacionFija;
  const saludValor = (salarioBase * pctSalud) / 100;
  const pensionValor = (salarioBase * pctPension) / 100;
  const deduccionesTotal = saludValor + pensionValor + valorEmbargo;
  const netoAPagar = devengadoTotal - deduccionesTotal;

  const formatCOP = (val) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(val);

  const handleSubmit = async (estadoPago = "Pagado") => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        id_empleado: empleado.id_empleado,
        periodo_inicio: periodoInicio,
        periodo_fin: periodoFin,
        fecha_programada: new Date().toISOString().slice(0, 10),
        estado_pago: estadoPago,
        total_devengado: devengadoTotal,
        total_deducciones: deduccionesTotal,
        total_pagar: netoAPagar,
      };

      const response = await fetch(`${API_V1_BASE_URL}/pagos-empleado/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "No fue posible registrar la liquidación de nómina.");
      }

      onSuccess && onSuccess(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl rounded-2xl border border-[#4d4732] bg-[#0d0e0f] p-6 shadow-2xl text-[#e3e2e2]">
        
        {/* Header Superior */}
        <div className="flex flex-col justify-between border-b border-[#1f1f1f] pb-4 md:flex-row md:items-center">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#ffd700]">
              MÓDULO DE GESTIÓN LABORAL • LIQUIDACIÓN Y CÓDIGO SUSTANTIVO DEL TRABAJO
            </span>
            <h1 className="mt-1 text-2xl font-black uppercase italic tracking-tight text-[#e3e2e2]">
              LIQUIDACIÓN INDIVIDUAL DE NÓMINA
            </h1>
            <p className="text-xs text-[#d0c6ab]">
              Desglose de devengados, deducciones de ley y orden de pago inmutable.
            </p>
          </div>

          <div className="mt-3 flex items-center gap-3 md:mt-0">
            <button
              onClick={onClose}
              className="flex items-center gap-2 rounded-lg border border-[#333] px-3 py-1.5 text-xs text-[#d0c6ab] hover:border-[#ffd700] hover:text-white"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Volver a Empleados
            </button>
            <div className="rounded-xl border border-[#4d4732] bg-[#121212] px-3 py-1.5 text-right">
              <p className="text-xs font-bold text-[#e3e2e2]">
                {empleado.nombre_usuario || `Empleado #${empleado.id_empleado}`}
              </p>
              <p className="text-[10px] font-mono text-[#ffd700]">
                Cédula: {empleado.numero_documento} • Cargo: {empleado.cargo}
              </p>
            </div>
          </div>
        </div>

        {/* Banner Metadatos del Periodo */}
        <div className="mt-4 grid gap-3 rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] p-3 text-xs md:grid-cols-4">
          <div>
            <span className="block text-[10px] font-bold uppercase text-[#d0c6ab]">Período de Liquidación</span>
            <div className="mt-1 flex items-center gap-1 font-mono text-[#e3e2e2]">
              <input
                type="date"
                value={periodoInicio}
                onChange={(e) => setPeriodoInicio(e.target.value)}
                className="rounded border border-[#333] bg-[#121212] px-1 py-0.5 text-xs text-white outline-none"
              />
              <span>a</span>
              <input
                type="date"
                value={periodoFin}
                onChange={(e) => setPeriodoFin(e.target.value)}
                className="rounded border border-[#333] bg-[#121212] px-1 py-0.5 text-xs text-white outline-none"
              />
            </div>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase text-[#d0c6ab]">Tipo de Contrato</span>
            <span className="mt-1 block font-semibold text-[#e3e2e2]">{empleado.tipo_contrato || "Término Indefinido"}</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase text-[#d0c6ab]">Salario Base Pactado</span>
            <span className="mt-1 block font-mono font-bold text-[#ffd700]">{formatCOP(salarioBase)} / mes</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase text-[#d0c6ab]">Estado del Proceso</span>
            <span className="mt-1 inline-block rounded-full bg-amber-950/60 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-800/40">
              Pendiente de Autorización
            </span>
          </div>
        </div>

        {/* Grid de Devengados vs Deducciones */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          
          {/* Tarjeta Devengados */}
          <div className="rounded-xl border border-[#4d4732] bg-[#0a0a0a] p-4">
            <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-2">
              <span className="flex items-center gap-2 text-xs font-black uppercase text-[#ffd700]">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                Ingresos y Devengados
              </span>
              <span className="text-[10px] text-[#d0c6ab]">Artículo 127 CST</span>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#d0c6ab]">Salario Base</span>
                <span className="font-mono font-bold text-white">{formatCOP(salarioBase)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#d0c6ab]">Auxilio de Transporte</span>
                <span className="font-mono font-bold text-white">{formatCOP(auxilioTransporte)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#d0c6ab]">Bonificación Fija por Rendimiento</span>
                <span className="font-mono font-bold text-white">{formatCOP(bonificacionFija)}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-[#1f1f1f] pt-2">
              <span className="text-xs font-bold uppercase text-[#ffd700]">Total Devengado</span>
              <span className="font-mono text-sm font-black text-[#ffd700]">{formatCOP(devengadoTotal)}</span>
            </div>
          </div>

          {/* Tarjeta Deducciones */}
          <div className="rounded-xl border border-[#4d4732] bg-[#0a0a0a] p-4">
            <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-2">
              <span className="flex items-center gap-2 text-xs font-black uppercase text-[#ffb4ab]">
                <span className="material-symbols-outlined text-sm">trending_down</span>
                Deducciones Legales y Retenciones
              </span>
              <span className="text-[10px] text-[#d0c6ab]">Artículo 150 CST</span>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#d0c6ab]">Aporte a Salud ({pctSalud}%)</span>
                <span className="font-mono font-bold text-red-400">-{formatCOP(saludValor)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#d0c6ab]">Aporte a Pensión ({pctPension}%)</span>
                <span className="font-mono font-bold text-red-400">-{formatCOP(pensionValor)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#d0c6ab]">
                  Retención Judicial / Embargo de Alimentos {tieneEmbargo ? "(Activo)" : "(Inactivo)"}
                </span>
                <span className="font-mono font-bold text-red-400">
                  {valorEmbargo > 0 ? `-${formatCOP(valorEmbargo)}` : "$0 COP"}
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-[#1f1f1f] pt-2">
              <span className="text-xs font-bold uppercase text-[#ffb4ab]">Total Deducciones Legales</span>
              <span className="font-mono text-sm font-black text-red-400">-{formatCOP(deduccionesTotal)}</span>
            </div>
          </div>

        </div>

        {/* Banner Definitivo de Liquidación */}
        <div className="mt-4 rounded-xl border border-[#ffd700]/40 bg-[#121212] p-4 shadow-inner">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#ffd700]">
                Monto Liquidado Definitivo
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-[#ffd700]">{formatCOP(netoAPagar)}</span>
                <span className="text-xs text-[#d0c6ab]">Total Devengado ({formatCOP(devengadoTotal)}) - Deducciones ({formatCOP(deduccionesTotal)})</span>
              </div>
            </div>

            <div className="grid flex-1 gap-2 md:grid-cols-2">
              <div>
                <label className="text-[10px] font-bold uppercase text-[#d0c6ab]">Medio de Pago / Dispersión</label>
                <input
                  type="text"
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#333] bg-[#080808] px-3 py-1.5 text-xs text-white outline-none focus:border-[#ffd700]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-[#d0c6ab]">Número de Comprobante / Referencia</label>
                <input
                  type="text"
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#333] bg-[#080808] px-3 py-1.5 text-xs text-white outline-none focus:border-[#ffd700]"
                />
              </div>
            </div>
          </div>

          <div className="mt-3">
            <label className="text-[10px] font-bold uppercase text-[#d0c6ab]">Observaciones o Notas Contables</label>
            <input
              type="text"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#333] bg-[#080808] px-3 py-1.5 text-xs text-white outline-none focus:border-[#ffd700]"
            />
          </div>
        </div>

        {/* Warning de Inmutabilidad */}
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-red-900/50 bg-red-950/20 p-3 text-xs text-red-300">
          <span className="material-symbols-outlined text-base text-red-400">lock</span>
          <div>
            <span className="font-bold text-[#ffb4ab]">REGLA DE INMUTABILIDAD DE PAGO:</span>
            <p className="text-[11px] text-[#d0c6ab]">
              Al registrar este pago con estado <strong>PAGADO</strong>, la transacción se sellará automáticamente en el sistema y no admitirá modificaciones ni eliminaciones posteriores.
            </p>
          </div>
        </div>

        {error && <div className="mt-3 rounded-lg border border-red-800 bg-red-950/40 p-2 text-xs text-red-300">{error}</div>}

        {/* Botones de Acción */}
        <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-[#1f1f1f] pt-4">
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-[#333] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#d0c6ab] hover:border-[#ffd700] hover:text-white"
          >
            Cancelar / Volver a la Lista
          </button>
          <button
            onClick={() => handleSubmit("Pendiente")}
            disabled={saving}
            className="rounded-lg border border-[#4d4732] bg-[#121212] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#ffd700] hover:bg-[#1f1f1f]"
          >
            Guardar como Pendiente
          </button>
          <button
            onClick={() => handleSubmit("Pagado")}
            disabled={saving}
            className="rounded-lg bg-[#ffd700] px-6 py-2.5 text-xs font-black uppercase tracking-wider text-black shadow-lg shadow-[#ffd700]/10 hover:bg-[#ffe16d]"
          >
            {saving ? "Procesando..." : "REGISTRAR Y SELLAR PAGO PAGADO"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default LiquidacionNominaModal;
