import LogoMarca from './LogoMarca';
import '../App.css'

function Proveedores() {
    return (
        <div className="bg-black text-white font-body-lg antialiased min-h-screen">
            <header className="bg-[#121212] border-b border-white/5 flex justify-between items-center w-full px-8 h-16 fixed top-0 z-50">
                <div className="flex items-center gap-8">
                    <div className="flex flex-col">
                        <LogoMarca subtitle size="sm" />
                    </div>
                    <div className="flex items-center gap-6 ml-4">
                        <div className="flex items-center gap-2 text-white/60">
                            <span className="material-symbols-outlined text-sm text-[#FFEE00]">store</span>
                            <span className="font-label-caps text-[10px] uppercase tracking-wider">Tienda Principal Bogota</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <button className="text-white/60 text-[10px] font-bold hover:text-[#FFEE00] transition-colors uppercase tracking-widest font-label-caps">INICIAR SESIÓN</button>
                    <button className="bg-[#FFEE00] text-black px-4 py-1.5 text-[10px] font-black hover:brightness-110 active:opacity-90 transition-all uppercase tracking-widest font-label-caps">REGISTRARSE</button>
                    <button className="text-white/40 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-lg">logout</span>
                    </button>
                </div>
            </header>

            <div className="flex min-h-screen pt-16">
                <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-65 bg-[#121212] border-r border-white/5 flex flex-col py-8 z-40">
                    <nav className="flex-1 space-y-0.5">
                        <a className="text-white/70 flex items-center px-6 py-3.5 font-label-caps uppercase text-[10px] tracking-widest hover:bg-white/5 hover:text-white transition-all" href="#">
                            <span className="material-symbols-outlined mr-3 text-lg text-[#FFEE00]">grid_view</span>
                            <span className="font-bold">Dashboard</span>
                        </a>
                        <a className="text-white/70 flex items-center px-6 py-3.5 font-label-caps uppercase text-[10px] tracking-widest hover:bg-white/5 hover:text-white transition-all" href="#">
                            <span className="material-symbols-outlined mr-3 text-lg text-[#FFEE00]">inventory_2</span>
                            <span className="font-bold">Inventario</span>
                        </a>
                        <a className="text-white/70 flex items-center px-6 py-3.5 font-label-caps uppercase text-[10px] tracking-widest hover:bg-white/5 hover:text-white transition-all" href="#">
                            <span className="material-symbols-outlined mr-3 text-lg text-[#FFEE00]">point_of_sale</span>
                            <span className="font-bold">Ventas/Cotizaciones</span>
                        </a>
                        <a className="bg-white/5 text-white flex items-center px-6 py-3.5 font-label-caps uppercase text-[10px] tracking-widest relative border-r-4 border-[#FFEE00]" href="#">
                            <span className="material-symbols-outlined mr-3 text-lg text-[#FFEE00]">shopping_cart</span>
                            <span className="font-bold">Compras/Proveedores</span>
                        </a>
                        <a className="text-white/70 flex items-center px-6 py-3.5 font-label-caps uppercase text-[10px] tracking-widest hover:bg-white/5 hover:text-white transition-all" href="#">
                            <span className="material-symbols-outlined mr-3 text-lg text-[#FFEE00]">group</span>
                            <span className="font-bold">Clientes</span>
                        </a>
                        <a className="text-white/70 flex items-center px-6 py-3.5 font-label-caps uppercase text-[10px] tracking-widest hover:bg-white/5 hover:text-white transition-all" href="#">
                            <span className="material-symbols-outlined mr-3 text-lg text-[#FFEE00]">badge</span>
                            <span className="font-bold">Empleados</span>
                        </a>
                        <a className="text-white/70 flex items-center px-6 py-3.5 font-label-caps uppercase text-[10px] tracking-widest hover:bg-white/5 hover:text-white transition-all" href="#">
                            <span className="material-symbols-outlined mr-3 text-lg text-[#FFEE00]">bar_chart_4_bars</span>
                            <span className="font-bold">Reportes</span>
                        </a>
                    </nav>
                    <div className="px-6 mb-6">
                        <button className="w-full bg-[#FFEE00] text-black font-label-caps font-black py-3.5 uppercase text-[11px] tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 rounded-lg">
                            <span className="material-symbols-outlined text-base">add_circle</span>
                            NUEVA VENTA
                        </button>
                    </div>
                    <div className="px-6 pt-6 border-t border-white/5">
                        <div className="flex items-center gap-3">
                            <img alt="Alex Rivera" className="w-10 h-10 rounded-full object-cover border border-white/10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgFvzzH2pmQqdAwqsW8_6CtAbP-qhTeQUjdm5ijco4lqp9chpqKs3exaSgQpYBDgSxc5hQJ7P9m2Rl-TSf95nA5FwqPW_BTEersKJYCnPK6wcqmW5eQ6myHhO9GQU9kWim2fWoONBrJ8Vcb3cu-4vWQl2LMnnxntF4SlsvruhxRVMVOu2fg6HtPNfXJW39GvLCBCFGEXc_Td-hhajsB5-DEC0SfDk7T2Y3n8xktU6IO80a7nQ2CzI4rAeAz_bCHERuhut9JnbuiSXm" />
                            <div className="flex-1 min-w-0">
                                <div className="text-white font-bold text-[11px] leading-tight truncate">Alex Rivera</div>
                                <div className="text-white/40 text-[9px] uppercase font-bold tracking-wider leading-tight">Gerente de Tienda</div>
                                <button className="text-[#FFEE00] text-[9px] font-black uppercase tracking-widest mt-1 hover:underline">CERRAR SESIÓN</button>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="ml-65 flex-1 bg-[#0A0A0A] text-white overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-12">
                            <h1 className="font-headline-xl text-headline-xl text-[#FFEE00] uppercase italic tracking-tighter mb-2">Selección de Proveedor</h1>
                            <div className="h-1 w-24 bg-[#FFEE00]"></div>
                            <p className="font-body-lg text-body-lg text-white/60 mt-6 max-w-2xl">
                                Acceda a los catálogos técnicos y gestione órdenes directas con nuestros socios estratégicos de componentes de alto rendimiento.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-xl">
                            
                            <div className="group relative bg-[#121212] border border-white/5 hover:border-[#FFEE00] transition-all duration-300 cursor-pointer overflow-hidden">
                                <div className="h-48 relative bg-black flex items-center justify-center p-8">
                                    <div className="absolute inset-0 bg-linear-to-br from-[#FFEE00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <img className="w-full h-auto object-contain grayscale group-hover:grayscale-0 transition-all" alt="Shimano" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEzzyCpu56CW2JsApe9r3T6jRIXHHk0ksHnmNXGLAlqJ3PLXjTlUYkO65sV6fKmmCRLdwZOF16IUNBBhrrfb8qWlH8wuQ_enwwmj-wJqXkNZ951nUVQXzX4TSJxUY4g2xh05SIw8qi1ojYTQIgNoK00077nxcyZxgDmptAMUgCJj44i2_OTfPFfOA-y1Qj-RqR6S3Iq6KXblEdIefTnddPYsmW4rFvHwdrqspCRmC-AjLxA_-NWPyPL5hI4WRQ6aHWkyO-MRkP5O0J" />
                                </div>
                                <div className="p-4 border-t border-white/5 group-hover:bg-[#FFEE00] transition-colors">
                                    <div className="flex justify-between items-center">
                                        <span className="font-label-caps font-bold uppercase text-[10px] text-white/70 group-hover:text-black">Shimano Components</span>
                                        <span className="material-symbols-outlined text-white/30 group-hover:text-black">arrow_forward</span>
                                    </div>
                                </div>
                            </div>

                           
                            <div className="group relative bg-[#121212] border border-white/5 hover:border-[#FFEE00] transition-all duration-300 cursor-pointer overflow-hidden">
                                <div className="h-48 relative bg-black flex items-center justify-center p-8">
                                    <div className="absolute inset-0 bg-linear-to-br from-[#FFEE00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <img className="w-full h-auto object-contain grayscale group-hover:grayscale-0 transition-all" alt="SRAM" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7aKACKiaekpYJzmlhndbZm140SCm0Kup2YA3p-tNepqbSkS0i2Zn0PzIqq-lVltXLPlrT-61ZFU7kjgqJ5537LnUVT_TVmBwDarlYIw_WorMl9Z0KsxzWVF7hm_OP4JoTq_j4gmJ8k0EuuR0HxkQTi4atchlbZlp8T33mEC-XG8_OUFRxihSvfArlPCu_bEL5Jj_xnPfFqrqFkDVhiAug4w28Asg4j2uf0yZt98R0FP6OhQdwWvGDmJzBFCl_hTan6U6F9Y78MGIy" />
                                </div>
                                <div className="p-4 border-t border-white/5 group-hover:bg-[#FFEE00] transition-colors">
                                    <div className="flex justify-between items-center">
                                        <span className="font-label-caps font-bold uppercase text-[10px] text-white/70 group-hover:text-black">SRAM Drivetrains</span>
                                        <span className="material-symbols-outlined text-white/30 group-hover:text-black">arrow_forward</span>
                                    </div>
                                </div>
                            </div>

                            <div className="group relative bg-[#121212] border border-white/5 hover:border-[#FFEE00] transition-all duration-300 cursor-pointer overflow-hidden">
                                <div className="h-48 relative bg-black flex items-center justify-center p-8">
                                    <div className="absolute inset-0 bg-linear-to-br from-[#FFEE00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <img className="w-full h-auto object-contain grayscale group-hover:grayscale-0 transition-all" alt="Trek" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCV5LA2xC_EAy9HeNvcFl6htIPCEq89U8gL-3SOo-vLsvQFovsKMuteEpnmRc99A8xoZoxvP8oEpwi0UaE-12pu2OsmQKNvm-eHFPMIUyaPLPfjNf15pN1iJy9NdNHrbVVis813jca7o36hoBauniimJSdE9OrAtU04wdehFMLJD6JCPHmKJLj7da0RXpnlmXIg4HpDp41TAArtxV3s6Y2-rseSWxrGunE2OLcJ5xP7IARs7g0taIdrJXDh3PJFgA4hMgWChEuByLMS" />
                                </div>
                                <div className="p-4 border-t border-white/5 group-hover:bg-[#FFEE00] transition-colors">
                                    <div className="flex justify-between items-center">
                                        <span className="font-label-caps font-bold uppercase text-[10px] text-white/70 group-hover:text-black">Trek Performance</span>
                                        <span className="material-symbols-outlined text-white/30 group-hover:text-black">arrow_forward</span>
                                    </div>
                                </div>
                            </div>

                            <div className="group relative bg-[#121212] border border-white/5 hover:border-[#FFEE00] transition-all duration-300 cursor-pointer overflow-hidden">
                                <div className="h-48 relative bg-black flex items-center justify-center p-8">
                                    <div className="absolute inset-0 bg-linear-to-br from-[#FFEE00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <img className="w-full h-auto object-contain grayscale group-hover:grayscale-0 transition-all" alt="Specialized" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdMqQtpL2miqmI0c3inUfoOOpGYSQbcHD8OQS4TXlq00K7wlSvX9T1a5p-QyA8448ZRM83IV1Dv0A_gQ555NI2ik0q7r7HLCRtFSpibmz1_Hnc8HsI7VTfQTtdsxWf-TdEkDTZnaY-scVnFVzFsWudqKVhB9KKuL4XJhRUrv4eA60g2jO5HJtx_VDJ3_vT3RM_sik5zFxiJNrMkcB7slD80FVAIQAtAl7JV6Dk1KVRdMuuuH-JTRrKCfBti-77M9yK0Co9NgOiN2Z_" />
                                </div>
                                <div className="p-4 border-t border-white/5 group-hover:bg-[#FFEE00] transition-colors">
                                    <div className="flex justify-between items-center">
                                        <span className="font-label-caps font-bold uppercase text-[10px] text-white/70 group-hover:text-black">Specialized Racing</span>
                                        <span className="material-symbols-outlined text-white/30 group-hover:text-black">arrow_forward</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-gutter">
                            <div className="col-span-12 lg:col-span-8 bg-[#121212] border border-white/5 p-6">
                                <div className="flex justify-between items-end mb-6">
                                    <h3 className="font-label-caps font-black uppercase text-[11px] tracking-widest text-[#FFEE00]">Estado de Envíos Recientes</h3>
                                    <button className="text-[9px] text-white/40 uppercase font-bold hover:text-[#FFEE00] font-label-caps">Ver Todo</button>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-4 bg-[#1c1c1c] border-l-4 border-[#FFEE00]">
                                        <div className="flex items-center gap-4">
                                            <span className="material-symbols-outlined text-[#FFEE00]">local_shipping</span>
                                            <div>
                                                <p className="font-label-caps font-bold text-[10px] uppercase">Shimano Order #4492</p>
                                                <p className="text-[9px] text-white/40 uppercase font-bold tracking-wider">12x Dura-Ace Groupset</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-label-caps text-[#FFEE00] text-[10px] font-black uppercase tracking-tight">En Tránsito</p>
                                            <p className="text-[9px] text-white/40 uppercase font-bold tracking-wider">ETA: 2h 45m</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-black/40 border-l-4 border-green-500">
                                        <div className="flex items-center gap-4">
                                            <span className="material-symbols-outlined text-green-500">check_circle</span>
                                            <div>
                                                <p className="font-label-caps font-bold text-[10px] uppercase">SRAM Stock Refill</p>
                                                <p className="text-[9px] text-white/40 uppercase font-bold tracking-wider">24x Red eTap AXS Batteries</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-label-caps text-green-500 text-[10px] font-black uppercase tracking-tight">Entregado</p>
                                            <p className="text-[9px] text-white/40 uppercase font-bold tracking-wider">Hace 4 horas</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-12 lg:col-span-4 bg-[#121212] border border-white/5 p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFEE00]/5 -mr-12 -mt-12 rounded-full blur-3xl"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-6">
                                        <span className="material-symbols-outlined text-[#FFEE00]">warning</span>
                                        <h3 className="font-label-caps font-black uppercase text-[11px] tracking-widest text-[#FFEE00]">Alertas de Stock</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span className="text-[10px] text-white/70 font-label-caps uppercase">Pastillas de Freno Sinter</span>
                                            <span className="text-[10px] font-bold text-red-500 uppercase font-label-caps">Crítico (2)</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span className="text-[10px] text-white/70 font-label-caps uppercase">Cadenas HG-901 11v</span>
                                            <span className="text-[10px] font-bold text-yellow-500 uppercase font-label-caps">Bajo (12)</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span className="text-[10px] text-white/70 font-label-caps uppercase">Tubeless Sealant 1L</span>
                                            <span className="text-[10px] font-bold text-yellow-500 uppercase font-label-caps">Bajo (5)</span>
                                        </div>
                                        <button className="w-full mt-4 py-2 border border-[#FFEE00]/30 text-[#FFEE00] uppercase font-label-caps font-black text-[10px] hover:bg-[#FFEE00]/10 transition-colors">
                                            Generar Orden Sugerida
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#FFEE00] text-black shadow-[0px_0px_20px_rgba(255,238,0,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
                <span className="material-symbols-outlined">barcode_scanner</span>
            </button>
        </div>
    )      
}

export default Proveedores;
