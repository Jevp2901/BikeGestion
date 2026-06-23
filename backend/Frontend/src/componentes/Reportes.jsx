import { useState } from 'react';
import '../App.css';

function Reportes() {
    // Estado para controlar un filtro de rango de fecha simulado
    const [rangoFecha, setRangoFecha] = useState('Este Mes');

    // Datos simulados del reporte (fáciles de conectar a un backend o API de BikeGestión)
    const [metricas, setMetricas] = useState([
        { id: 1, titulo: 'INGRESOS TOTALES', valor: '$24,850,200', cambio: '+14.2%', tendencia: 'up', desc: 'Ventas de bicicletas y repuestos' },
        { id: 2, titulo: 'SERVICIOS TALLER', valor: '342', cambio: '+8.5%', tendencia: 'up', desc: 'Órdenes de trabajo completadas' },
        { id: 3, titulo: 'TICKET PROMEDIO', valor: '$145,000', cambio: '-2.1%', tendencia: 'down', desc: 'Gasto medio por cliente en Bogotá' },
        { id: 4, titulo: 'MARGEN OPERATIVO', valor: '32.4%', cambio: '+1.8%', tendencia: 'up', desc: 'Rendimiento neto de la tienda' }
    ]);

    const [transacciones, setTransacciones] = useState([
        { id: '#BK-9821', cliente: 'Julian Alvarez', tipo: 'Venta', item: 'Bicicleta de Ruta Trek Emonda', valor: '$8,450,000', estado: 'Completado' },
        { id: '#BK-9820', cliente: 'Marcus Johnson', tipo: 'Taller', item: 'Mantenimiento General + Pastillas XT', valor: '$245,000', estado: 'Completado' },
        { id: '#BK-9819', cliente: 'Mateo Silva', tipo: 'Venta', item: 'Casco Fox Speedframe Pro', valor: '$580,000', estado: 'Completado' },
        { id: '#BK-9818', cliente: 'Helena Martinez', tipo: 'Taller', item: 'Radiado de Ruedas Carbono (Par)', valor: '180,000', estado: 'Pendiente' },
        { id: '#BK-9817', cliente: 'Carlos Mendoza', tipo: 'Venta', item: 'Grupo Shimano Deore M6100 12v', valor: '$1,350,000', estado: 'Completado' }
    ]);

    return (
        <div>
                    {/* Header de la sección */}
                    <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
                        <div>
                            <h1 className="text-white font-black italic italic-title text-3xl uppercase tracking-tight">Módulos de Reportes y Analítica</h1>
                            <p className="text-white/40 text-[11px] uppercase tracking-wider font-bold mt-1 max-w-xl">
                                Monitorea el rendimiento financiero, la productividad del taller de ciclismo y la eficiencia en los flujos de caja.
                            </p>
                        </div>

                        {/* Controles de Filtro */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 bg-[#141414] border border-white/10 px-4 py-2 rounded-lg">
                                <span className="font-label-caps text-[10px] text-white/60 uppercase tracking-wider">Período:</span>
                                <select
                                    value={rangoFecha}
                                    onChange={(e) => setRangoFecha(e.target.value)}
                                    className="bg-transparent border-none text-xs font-bold text-[#FFEE00] focus:ring-0 outline-none cursor-pointer uppercase tracking-wider"
                                >
                                    <option value="Hoy" className="bg-[#141414] text-white">Hoy</option>
                                    <option value="Esta Semana" className="bg-[#141414] text-white">Esta Semana</option>
                                    <option value="Este Mes" className="bg-[#141414] text-white">Este Mes (Mayo)</option>
                                    <option value="Año Fiscal" className="bg-[#141414] text-white">Año Fiscal 2026</option>
                                </select>
                            </div>

                            <button className="bg-[#FFEE00] text-black px-5 py-2.5 text-[10px] font-black hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2 uppercase tracking-widest font-label-caps rounded-lg">
                                <span className="material-symbols-outlined text-sm normal-case">download</span>
                                Exportar PDF
                            </button>
                        </div>
                    </div>

                    {/* Grid Bento de Métricas Principales */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
                        {metricas.map((metrica) => (
                            <div key={metrica.id} className="bg-[#141414] border border-white/5 p-6 relative overflow-hidden group rounded-lg hover:border-white/20 transition-all duration-300">
                                <div className="absolute left-0 top-6 w-1 h-4 bg-[#FFEE00]" />
                                <div className="pl-2">
                                    <h4 className="text-[9px] font-bold text-white/40 uppercase tracking-[0.15em] mb-1">{metrica.titulo}</h4>
                                    <div className="flex items-end gap-2 mb-2">
                                        <span className="text-3xl font-black italic italic-title tracking-tight text-white">{metrica.valor}</span>
                                        <span className={`text-[10px] font-black font-data-mono flex items-center gap-0.5 mb-1 ${metrica.tendencia === 'up' ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                            <span className="material-symbols-outlined text-xs normal-case">
                                                {metrica.tendencia === 'up' ? 'trending_up' : 'trending_down'}
                                            </span>
                                            {metrica.cambio}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-white/40 font-medium tracking-wide uppercase">{metrica.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sección Avanzada: Gráfico e Historial */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                        {/* Panel Izquierdo: Rendimiento de Operaciones (8 de 12) */}
                        <div className="xl:col-span-8 bg-[#141414] border border-white/5 rounded-lg overflow-hidden">
                            <div className="px-6 py-4 bg-white/10 border-b border-white/5 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-[#FFEE00]"></span>
                                    <h2 className="font-label-caps text-white uppercase text-[11px] tracking-widest font-black">Historial Operativo de Transacciones</h2>
                                </div>
                                <span className="text-[9px] font-data-mono text-[#FFEE00] uppercase tracking-wider bg-[#FFEE00]/10 border border-[#FFEE00]/20 px-2 py-0.5 rounded">En tiempo real</span>
                            </div>

                            {/* Tabla de Datos de Reportes */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-black/20 text-white/40 text-[9px] font-bold uppercase tracking-wider">
                                            <th className="px-6 py-4">ID Transacción</th>
                                            <th className="px-6 py-4">Cliente / Operador</th>
                                            <th className="px-6 py-4">Módulo</th>
                                            <th className="px-6 py-4">Detalle del Item</th>
                                            <th className="px-6 py-4 text-right">Valor Neto</th>
                                            <th className="px-6 py-4 text-center">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {transacciones.map((tx) => (
                                            <tr key={tx.id} className="hover:bg-white/1 transition-colors text-xs">
                                                <td className="px-6 py-4 font-data-mono font-bold text-[#FFEE00]">{tx.id}</td>
                                                <td className="px-6 py-4 font-medium text-white/80">{tx.cliente}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border ${tx.tipo === 'Venta'
                                                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                            : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                        }`}>
                                                        {tx.tipo}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-white/60 max-w-xs truncate">{tx.item}</td>
                                                <td className="px-6 py-4 text-right font-data-mono font-bold text-white/90">{tx.valor}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`text-[9px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-widest ${tx.estado === 'Completado'
                                                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                            : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                                        }`}>
                                                        {tx.estado}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Panel Derecho: Canales y Acciones Rápidas (4 de 12) */}
                        <div className="xl:col-span-4 space-y-6">

                            {/* Card de Distribución de Canales */}
                            <div className="bg-[#141414] border border-white/5 p-6 relative rounded-lg">
                                <div className="absolute left-0 top-6 w-1 h-4 bg-[#FFEE00]" />
                                <div className="flex items-center gap-2 mb-6 pl-2">
                                    <span className="material-symbols-outlined text-[#FFEE00] text-lg normal-case">pie_chart</span>
                                    <h2 className="font-label-caps text-white uppercase text-[11px] tracking-widest font-black">Canales de Ingreso</h2>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { canal: 'Venta de Bicicletas Directa', porcentaje: 65, color: 'bg-[#FFEE00]' },
                                        { canal: 'Mano de Obra / Taller Técnico', porcentaje: 23, color: 'bg-purple-500' },
                                        { canal: 'Componentes y Accesorios', porcentaje: 12, color: 'bg-blue-400' }
                                    ].map((item, index) => (
                                        <div key={index} className="space-y-1.5">
                                            <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                                                <span className="text-white/70">{item.canal}</span>
                                                <span className="text-white font-data-mono">{item.porcentaje}%</span>
                                            </div>
                                            <div className="w-full bg-black h-1.5 rounded-full overflow-hidden">
                                                <div className={`${item.color} h-full`} style={{ width: `${item.porcentaje}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Card de Acciones de Integración API / Sistemas */}
                            <div className="bg-[#141414] border border-white/10 p-6 relative overflow-hidden rounded-lg group">
                                <div className="absolute left-0 top-6 w-1 h-4 bg-[#FFEE00]" />
                                <div className="pl-2">
                                    <h4 className="text-[9px] font-bold text-[#FFEE00] uppercase tracking-[0.2em] mb-4">Integración y Exportación Extensible</h4>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button className="px-4 py-3 bg-black border border-white/5 hover:border-white/20 text-[10px] font-bold font-label-caps uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                                            <span className="material-symbols-outlined text-sm text-[#FFEE00] normal-case">table_chart</span>
                                            EXCEL
                                        </button>
                                        <button className="px-4 py-3 bg-black border border-white/5 hover:border-white/20 text-[10px] font-bold font-label-caps uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                                            <span className="material-symbols-outlined text-sm text-[#FFEE00] normal-case">share</span>
                                            ENVÍO API
                                        </button>
                                    </div>

                                    <div className="flex justify-between gap-4 mt-6 pt-4 border-t border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] uppercase text-white/40 font-bold tracking-wide">Sincronización</span>
                                            <span className="text-xs font-bold font-data-mono text-white/80 mt-0.5">Hace 2 mins</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[9px] uppercase text-white/40 font-bold tracking-wide">Fidelidad de Datos</span>
                                            <span className="text-xs font-bold text-green-400 font-data-mono mt-0.5">99.9% EXACTO</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
        </div>
    );
}

export default Reportes;