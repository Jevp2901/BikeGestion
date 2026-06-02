import { useState } from 'react'
import '../App.css'

function Empleados() {
    const [trackingTurnos, setTrackingTurnos] = useState(true)

    const [empleados, setEmpleados] = useState([
        {
            id: 1,
            nombre: 'Julian Alvarez',
            rol: 'Mecánico Líder',
            estado: 'Activo Ahora',
            turnoInfo: 'En Turno: 06:42h',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHcWGEpO51L-oS_aOLMGkH3BW6aGIfbBM4xHLSlCUJi1v-WzK71zwReJWUVerLyi5v3EX7KCcjgLg8M7LawxelVrg3txkFvcG2qjcqqg0bqs9rWPdgdyhJ5sQCZK_9tp1xV4SqweimS1VWa6-2Bx437nFLii12Pojs9cFgzPSCkhdOEX6IC6UEqQp1FSbPgmHunqPKsa4ECA5Wr7A0-smYlIzYGxTQjt-oooRDeVHEHNYyI0Y05bVmasfsc0MidntPynua2aoaaWU',
            permisos: ['build', 'inventory_2']
        },
        {
            id: 2,
            nombre: 'Marcus Johnson',
            rol: 'Especialista en Ventas',
            estado: 'Ausente',
            turnoInfo: 'Visto por última vez: hace 2h',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuhmwYNVK0Olzc4vU27Ku4-gJF2df0jo37mMBsIjcwkFguxNyjC5Rf4oiYFdTSlLfEoPi_F_Y_3JpR-Jl9JfUp5zLemEdyiOzbesxT3ROO4R6tvE6twBNFC6yOXomEIZJaIKBEam6p74LcigHoXt3Bhw9FfOA3woq1PTZjl90TDUqvCu88NLrFMdi1i0noOnxtsYdpSfuzZhGsA49tdmAo5PhjTgz_ffi3EkZ5tIhHadu4O1NIXRbvpVPguumqeaYfrh35sS2vmc0',
            permisos: ['point_of_sale', 'groups']
        },
        {
            id: 3,
            nombre: 'Mateo Silva',
            rol: 'Mecánico Junior',
            estado: 'Activo Ahora',
            turnoInfo: 'En Turno: 03:15h',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAccvfD3-ovn17auYHnjiaShW-BywYQI7ijqwfNSJGSH68Bik0Gct4mcfeF1kU_A7j4vt2BS3vh6eF2_9x5kJHg_1cnaHxw6yvMxw7AAvJCB923Rh0O_0-O5QqxFlQNjbvcCElZJxAquRbTgoHsJwRVy9g4WOw5RkuFiKnadCeQaCKgVXp0VFFuv32qmnHakvQB8xt0UqjU7ONjUEB3OlNo7LlhTfpgezPLAueosK4X0CjnA23UMOz-CswySGjdQqSYRJKLXX_bHbs',
            permisos: ['build']
        },
        {
            id: 4,
            nombre: 'Helena Martinez',
            rol: 'Gerente de Tienda / Admin',
            estado: 'Admin del Sistema',
            turnoInfo: 'Acceso Total',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_uVa6Kie-M-ZRTlOCiG7dvCHdl_ziiVMae043Ehf8-OuaLsaaOBcQwCUZmH3xZoJBRpi7SSd0OTk7CF4fsSsMIBfdkJK8V2ln0wGx_AC9tffGlvX5FQVl0jCHwvT7I-ARww1iZm1zDmZr-UIQbKPJE5Vz7hQJsTEVdIgiI6dN5gRMXvVQBrXN6v1-uhmVu4_wp8gYG3PbrDup2HBExGJFRMuT7psEoIj86y6TSpMP68jYQ_5OiWOPKn6wRs_YuK-fiq9WDiB5H4Y',
            permisos: ['all']
        }
    ])

    return (
        <div>
                    {/* Header de la sección */}
                    <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
                        <div>
                            <h1 className="text-white font-black italic italic-title text-3xl uppercase tracking-tight">Equipo y Permisos de Usuario</h1>
                            <p className="text-white/40 text-[11px] uppercase tracking-wider font-bold mt-1 max-w-xl">
                                Gestiona a tu equipo de alto rendimiento, establece niveles de acceso granulares y rastrea la velocidad operativa.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 bg-[#141414] border border-white/10 px-4 py-2.5">
                                <span className="font-label-caps text-[10px] text-white/60 uppercase tracking-wider">Seguimiento de Turnos</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={trackingTurnos}
                                        onChange={() => setTrackingTurnos(!trackingTurnos)}
                                    />
                                    <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-black peer-checked:after:bg-black after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FFEE00]"></div>
                                </label>
                            </div>

                            <button className="bg-[#FFEE00] text-black px-5 py-2.5 text-[10px] font-black hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2 uppercase tracking-widest font-label-caps rounded-lg">
                                {/* Corrección: normal-case añadido */}
                                <span className="material-symbols-outlined text-sm normal-case">person_add</span>
                                Añadir Empleado
                            </button>
                        </div>
                    </div>

                    {/* Grid Principal Bento */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter">

                        {/* Columna Izquierda (8 de 12) */}
                        <div className="xl:col-span-8 space-y-gutter">

                            {/* Grid Interno de Empleados - Forzado a 2 Columnas Estrictas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                                {empleados.map((empleado) => (
                                    <div key={empleado.id} className="bg-[#141414] border border-white/5 p-6 flex flex-col justify-between overflow-hidden group hover:border-white/20 hover:-translate-y-1 transition-all duration-300 rounded-lg">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex gap-4">
                                                <img
                                                    alt={empleado.nombre}
                                                    className="w-14 h-14 rounded-lg object-cover border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-300"
                                                    src={empleado.avatar}
                                                />
                                                <div>
                                                    <h3 className="font-headline-md text-white uppercase italic-title tracking-tight text-base">{empleado.nombre}</h3>
                                                    <p className="text-[#FFEE00] text-[10px] font-black uppercase tracking-wider mt-0.5">{empleado.rol}</p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <span className={`text-[9px] px-2.5 py-0.5 font-bold uppercase tracking-widest font-label-caps border rounded-lg ${empleado.estado.includes('Activo')
                                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                    : empleado.estado.includes('Admin')
                                                        ? 'bg-[#FFEE00]/10 text-[#FFEE00] border-[#FFEE00]/20'
                                                        : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                                    }`}>
                                                    {empleado.estado}
                                                </span>
                                                <p className="text-[9px] font-data-mono text-white/40 mt-1.5">{empleado.turnoInfo}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                            <div className="flex gap-1.5">
                                                {empleado.permisos.includes('all') ? (
                                                    <span className="text-[9px] font-bold text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 uppercase tracking-wider rounded-lg">Acceso Total</span>
                                                ) : (
                                                    /* Corrección: Contenedor flex con alineación correcta */
                                                    <div className="flex gap-2 items-center">
                                                        {empleado.permisos.map((icon, index) => (
                                                            <div key={index} className="w-7 h-7 bg-black border border-white/5 flex items-center justify-center rounded-lg">
                                                                {/* Corrección: normal-case añadido */}
                                                                <span className="material-symbols-outlined text-sm text-[#FFEE00] normal-case">{icon}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <button className="text-white/40 hover:text-[#FFEE00] flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest font-label-caps transition-colors">
                                                <span>{empleado.permisos.includes('all') ? 'Ajustes' : 'Permisos'}</span>
                                                {/* Corrección: normal-case añadido */}
                                                <span className="material-symbols-outlined text-sm normal-case">chevron_right</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Telemetría de Actividad */}
                            <div className="bg-[#141414] border border-white/5 rounded-lg">
                                <div className="px-6 py-4 bg-white/2 border-b border-white/5 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#FFEE00]"></span>
                                        <h2 className="font-label-caps text-white uppercase text-[11px] tracking-widest font-black">Telemetría de Actividad</h2>
                                    </div>
                                    <button className="text-[9px] font-label-caps text-[#FFEE00] uppercase tracking-widest hover:underline">Ver Todos los Registros</button>
                                </div>

                                <div className="divide-y divide-white/5">
                                    <div className="px-6 py-4 flex items-center justify-between hover:bg-white/1 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-9 h-9 bg-black border border-white/5 flex items-center justify-center rounded-lg">
                                                {/* Corrección: normal-case añadido */}
                                                <span className="material-symbols-outlined text-[#FFEE00] text-sm normal-case">shopping_cart</span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-white/80 font-medium">
                                                    <span className="text-[#FFEE00] font-bold">Elena Rojas</span> procesó una nueva Venta #8291
                                                </p>
                                                <p className="text-[9px] font-data-mono text-white/30 uppercase mt-0.5">Mostrador de Ventas A • 12:45 PM</p>
                                            </div>
                                        </div>
                                        <span className="font-data-mono text-[#FFEE00] text-xs font-bold">$1,240.00</span>
                                    </div>

                                    <div className="px-6 py-4 flex items-center justify-between hover:bg-white/1 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-9 h-9 bg-black border border-white/5 flex items-center justify-center rounded-lg">
                                                {/* Corrección: normal-case añadido */}
                                                <span className="material-symbols-outlined text-[#FFEE00] text-sm normal-case">build</span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-white/80 font-medium">
                                                    <span className="text-[#FFEE00] font-bold">Julian Alvarez</span> completó el Servicio: Inspección de Cuadro de Carbono
                                                </p>
                                                <p className="text-[9px] font-data-mono text-white/30 uppercase mt-0.5">Bahía de Taller 1 • 11:30 AM</p>
                                            </div>
                                        </div>
                                        <span className="text-[9px] px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 font-bold uppercase tracking-wider rounded-lg">Éxito</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Columna Derecha (4 de 12) */}
                        <div className="xl:col-span-4 space-y-gutter">

                            {/* Permisos Rápidos */}
                            <div className="bg-[#141414] border border-white/10 p-6 relative rounded-lg">
                                <div className="absolute left-0 top-6 w-1 h-4 bg-[#FFEE00]" />
                                <div className="flex justify-between items-center mb-6 pl-4">
                                    <div className="flex items-center gap-2">
                                        {/* Corrección: normal-case añadido */}
                                        <span className="material-symbols-outlined text-[#FFEE00] text-lg normal-case">admin_panel_settings</span>
                                        <h2 className="font-label-caps text-white uppercase text-[11px] tracking-widest font-black">Permisos Rápidos</h2>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[9px] font-bold uppercase tracking-[0.15em] text-white/40 mb-2">Editar Alcance de Rol</label>
                                        <select className="w-full bg-black border border-white/10 text-xs font-bold text-white py-3 px-4 focus:border-[#FFEE00] focus:ring-0 outline-none uppercase tracking-wider rounded-lg">
                                            <option>Mecánico (Estándar)</option>
                                            <option>Asociado de Ventas</option>
                                            <option>Gerente de Tienda</option>
                                        </select>
                                    </div>

                                    <div className="bg-black/40 border border-white/5 p-4 space-y-4">
                                        {[
                                            { titulo: 'Acceso al Inventario', desc: 'Permitir visualización y ajustes de stock', defaultChecked: true },
                                            { titulo: 'Procesar Reembolsos', desc: 'Autorizar reversiones financieras', defaultChecked: false },
                                            { titulo: 'Programación de Servicios', desc: 'Modificar calendarios de mecánicos', defaultChecked: true }
                                        ].map((perm, index) => (
                                            <div key={index} className="flex items-center justify-between gap-4">
                                                <div>
                                                    <p className="text-xs font-bold text-white uppercase tracking-tight leading-none">{perm.titulo}</p>
                                                    <p className="text-[9px] text-white/40 font-medium mt-1">{perm.desc}</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    defaultChecked={perm.defaultChecked}
                                                    className="w-4 h-4 bg-black border-white/20 text-[#FFEE00] focus:ring-0 focus:ring-offset-0 rounded-lg"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <button className="w-full py-4 bg-transparent border border-[#FFEE00] text-[#FFEE00] font-label-caps uppercase text-[11px] font-black tracking-widest hover:bg-[#FFEE00] hover:text-black transition-all flex items-center justify-center rounded-lg">
                                        Aplicar a todos los Mecánicos
                                    </button>
                                </div>
                            </div>

                            {/* Métrica de Eficiencia */}
                            <div className="bg-[#141414] border border-white/10 p-6 relative overflow-hidden group rounded-lg">
                                <div className="absolute left-0 top-6 w-1 h-4 bg-[#FFEE00]" />
                                <div className="relative z-10 pl-4">
                                    <h4 className="text-[9px] font-bold text-[#FFEE00] uppercase tracking-[0.2em] mb-1">Métrica de Eficiencia</h4>

                                    <div className="flex items-end gap-2 mb-4">
                                        <span className="text-4xl font-black text-white italic italic-title tracking-tighter leading-none">94.2%</span>
                                        <span className="text-green-400 text-[10px] font-black font-data-mono flex items-center gap-0.5 mb-0.5">
                                            {/* Corrección: normal-case añadido */}
                                            <span className="material-symbols-outlined text-xs normal-case">trending_up</span> +2.4%
                                        </span>
                                    </div>

                                    <p className="text-[11px] text-white/40 font-medium leading-relaxed uppercase tracking-wide">
                                        La puntualidad del equipo y la tasa de finalización de tareas están por encima del objetivo esta semana.
                                    </p>

                                    <div className="mt-5 pt-4 border-t border-white/5">
                                        <div className="w-full bg-black h-1 rounded-lg overflow-hidden">
                                            <div className="bg-[#FFEE00] h-full w-[94.2%]"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Corrección: normal-case añadido */}
                                <span className="material-symbols-outlined absolute -bottom-6 -right-6 text-8xl text-white/2 font-thin group-hover:rotate-12 transition-transform duration-700 select-none normal-case">
                                    timer
                                </span>
                            </div>

                        </div>

                    </div>
        </div>
    )
}

export default Empleados
