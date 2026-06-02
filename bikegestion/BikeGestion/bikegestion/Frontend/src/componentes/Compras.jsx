import "../App.css";

function Compras() {
  return (
    <div>
        {/* Internal Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                className="px-5 py-2 bg-[#FFEE00] text-black font-label-caps uppercase text-[10px] font-black">TODOS
                LOS COMPONENTES</button>
              <button
                className="px-5 py-2 bg-[#181818] border border-white/10 text-white/70 font-label-caps uppercase text-[10px] hover:border-[#FFEE00] hover:text-white transition-all">ACCESORIOS</button>
              <button
                className="px-5 py-2 bg-[#181818] border border-white/10 text-white/70 font-label-caps uppercase text-[10px] hover:border-[#FFEE00] hover:text-white transition-all">HERRAMIENTAS</button>
              <button
                className="px-5 py-2 bg-[#181818] border border-white/10 text-white/70 font-label-caps uppercase text-[10px] hover:border-[#FFEE00] hover:text-white transition-all">LUBRICANTES</button>
            </div>
            {/* Search Section + Cart History */}
            <div className="flex items-center gap-4 min-w-100">
              <div className="relative flex-1">
                <span
                  className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30">search</span>
                <input
                  className="bg-[#141414] border border-white/10 text-white font-data-mono text-xs py-3.5 pl-12 pr-4 w-full focus:border-[#FFEE00] focus:ring-0 outline-none transition-all placeholder:text-white/20 uppercase"
                  placeholder="BUSCAR EN CATÁLOGO..." type="text" />
              </div>
              <button
                className="flex items-center gap-2 bg-[#141414] border border-white/10 hover:border-[#FFEE00] transition-all px-4 py-3.25 group">
                <span
                  className="material-symbols-outlined text-white/40 group-hover:text-[#FFEE00]">history</span>
                <span
                  className="font-label-caps text-[10px] text-white/40 group-hover:text-white uppercase tracking-wider whitespace-nowrap">Historial
                  del Carrito</span>
              </button>
            </div>
          </div>
        </div>
        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter">
          {/* Left Column (Catalog) */}
          <div className="xl:col-span-8 space-y-gutter">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {/* Product Card 1 */}
              <div
                className="bg-[#141414] border border-white/5 overflow-hidden group hover:border-white/20 transition-all duration-300">
                <div className="h-56 relative overflow-hidden bg-black">
                  <img alt="Ultegra Groupset"
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwiFU1-VTPAfeFIwlBWV1g8Q8OJ47vlbnrlo9drkGxtR0HuGmawiCDwDNeK9h9Ib56gdxoYiOtnt6LepvmB-bEooaRTeE9zMySWlTvCdRI8iLKnE6kabfiz2uU8KJNkk-aYA__Yhx5zWGm4m66csiiVGnzj0jiGx77kaan7MOrNcWkNrOizJUUUWb5i6vNQos351LROMExpI5djrNx6RK6peNxVIDIoZaf8F3hoB9HkN3ZmW4YlJv_0iLdzTeTGqzxi8aStSGXaOj3" />
                  <div
                    className="absolute top-3 right-3 bg-black/80 backdrop-blur px-2 py-1 text-[10px] font-data-mono text-[#FFEE00] border border-[#FFEE00]/30">
                    STOCK: 12</div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-headline-md text-white uppercase italic-title tracking-tight">
                        Ultegra Groupset</h3>
                      <p className="text-[10px] text-white/40 uppercase font-label-caps mt-1">Ref:
                        SH-U8000-D</p>
                    </div>
                    <span className="font-data-mono text-[#FFEE00] text-lg">$1,249.00</span>
                  </div>
                  <button
                    className="w-full py-4 bg-transparent border border-[#FFEE00] text-[#FFEE00] font-label-caps uppercase text-[11px] font-black tracking-widest hover:bg-[#FFEE00] hover:text-black transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                    AÑADIR AL PEDIDO
                  </button>
                </div>
              </div>
              {/* Product Card 2 */}
              <div
                className="bg-[#141414] border border-white/5 overflow-hidden group hover:border-white/20 transition-all duration-300">
                <div className="h-56 relative overflow-hidden bg-black">
                  <img alt="Dura-Ace Pedals"
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8ESdarQ9rq20TRodElgdD4edGnhlgHb6FQA5gQKrfewChTEbs0KyeXnis8Id5Q2ve2KkqSB04rsedZ2T_vW43zfM77F0jVvSTLriCCec4Uk2PgIIQZt_l0xu4OXG0F9TnfwSngLBt5bWMAGbuLPXJvXP2N2vhZsMzqJAK15DIDSQZwPyV4v-ZQu98W4Q95rk6jbYiNpXanYNq1nXNETzMBuZQSMfRPGIOFfkD40cN3TpMd0W4JZtjffJKuvGCkvKW-U32uaLT1vWk" />
                  <div
                    className="absolute top-3 right-3 bg-red-950/80 backdrop-blur px-2 py-1 text-[10px] font-data-mono text-red-400 border border-red-500/30">
                    STOCK BAJO: 2</div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-headline-md text-white uppercase italic-title tracking-tight">
                        Dura-Ace Pedals</h3>
                      <p className="text-[10px] text-white/40 uppercase font-label-caps mt-1">Ref:
                        SH-PD9100</p>
                    </div>
                    <span className="font-data-mono text-[#FFEE00] text-lg">$280.00</span>
                  </div>
                  <button
                    className="w-full py-4 bg-transparent border border-[#FFEE00] text-[#FFEE00] font-label-caps uppercase text-[11px] font-black tracking-widest hover:bg-[#FFEE00] hover:text-black transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                    AÑADIR AL PEDIDO
                  </button>
                </div>
              </div>
              <div
                className="bg-[#141414] border border-white/5 overflow-hidden group hover:border-white/20 transition-all duration-300">
                <div className="h-56 relative overflow-hidden bg-black">
                  <img alt="Carbon Wheelset"
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFjDQebrmTqVRKnU6LYi0FHco1yiwYdQeBbOSGQcf7uvYdcNJgz2JD0Dvw2300xiEL8duNZvUnL-xaqQzykVTAI-LcKaPf9Mu_mQfC3u3b7AvBvlLqHNYD2VFPmOt2tBqaoZrTMXrQOHNqBOMIl43bCrviyMgQtTF8gLsRp4OO_-tjgRCaoKqfRZQW5QYQSJEooZVXqW0zxhz5h_iBAMc8Lvusa99L0DSmQMhkYHjvF_ItOonQNTOC9Z_UWStaLhzk2fhy3pxumDRZ" />
                  <div
                    className="absolute top-3 right-3 bg-black/80 backdrop-blur px-2 py-1 text-[10px] font-data-mono text-[#FFEE00] border border-[#FFEE00]/30">
                    STOCK: 8</div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-headline-md text-white uppercase italic-title tracking-tight">
                        Zipp 303 Wheelset</h3>
                      <p className="text-[10px] text-white/40 uppercase font-label-caps mt-1">Ref:
                        ZP-303-C</p>
                    </div>
                    <span className="font-data-mono text-[#FFEE00] text-lg">$1,850.00</span>
                  </div>
                  <button
                    className="w-full py-4 bg-transparent border border-[#FFEE00] text-[#FFEE00] font-label-caps uppercase text-[11px] font-black tracking-widest hover:bg-[#FFEE00] hover:text-black transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                    AÑADIR AL PEDIDO
                  </button>
                </div>
              </div>
              <div
                className="bg-[#141414] border border-white/5 overflow-hidden group hover:border-white/20 transition-all duration-300">
                <div className="h-56 relative overflow-hidden bg-black">
                  <img alt="Hydraulic Brakes"
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLwJxUKglqi_MS2UaKqie2KdaZEdvRMXKwww1mGV4R_0mv10_9aOxrj8Wj4h7ikMqCE3dZ2ajDu3fvl2LoVZd7OWE9FvlCQVx7US9mOtYXMdnUN4p5MgORRz79ytKf1dGoG1dBX7Qk5WbYNorRXjuBqhqk90HBd-TZnZ4pacv0nniNmJXKFoHRs1zWCVH_qWqzsp6-__DgkWkdllQf1NyBaee3yrs5ozGrCa3Sg5qIlopzvG7FvYhbLsdhbdMlagbg3BU0R706Lh92" />
                  <div
                    className="absolute top-3 right-3 bg-red-950/80 backdrop-blur px-2 py-1 text-[10px] font-data-mono text-red-400 border border-red-500/30">
                    STOCK BAJO: 3</div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-headline-md text-white uppercase italic-title tracking-tight">
                        Magura MT7 Pro</h3>
                      <p className="text-[10px] text-white/40 uppercase font-label-caps mt-1">Ref:
                        MG-MT7-P</p>
                    </div>
                    <span className="font-data-mono text-[#FFEE00] text-lg">$450.00</span>
                  </div>
                  <button
                    className="w-full py-4 bg-transparent border border-[#FFEE00] text-[#FFEE00] font-label-caps uppercase text-[11px] font-black tracking-widest hover:bg-[#FFEE00] hover:text-black transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                    AÑADIR AL PEDIDO
                  </button>
                </div>
              </div>
              <div
                className="bg-[#141414] border border-white/5 overflow-hidden group hover:border-white/20 transition-all duration-300">
                <div className="h-56 relative overflow-hidden bg-black">
                  <img alt="Suspension Fork"
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyYBgJ_DFwlu8uuBncH5OhuRWiHuJ9yTH7yaGgcl1l-fO0RJF1xucwBMRThLRyf4E-oT4sDIxKKyAoubv4t31YgNVTOGpVsubyC77BTR4DyqSpffKgngXQ6jhU5CvSPAIC8daTxlmv0-3LF5RY-ua7bM4MjpwZL28aUqgp5lNzOoZjQQ9ze12JCZCKH65WYPNjS1bu8T9y_wuZ-Cri3F8ZenPYWxjOZDwneqPsv27aexZ5JlLh_iWJ4qbYBV7b6iGldDNQHSAJWtsP" />
                  <div
                    className="absolute top-3 right-3 bg-black/80 backdrop-blur px-2 py-1 text-[10px] font-data-mono text-[#FFEE00] border border-[#FFEE00]/30">
                    STOCK: 5</div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-headline-md text-white uppercase italic-title tracking-tight">
                        Fox 38 Factory</h3>
                      <p className="text-[10px] text-white/40 uppercase font-label-caps mt-1">Ref:
                        FX-38F-29</p>
                    </div>
                    <span className="font-data-mono text-[#FFEE00] text-lg">$1,189.00</span>
                  </div>
                  <button
                    className="w-full py-4 bg-transparent border border-[#FFEE00] text-[#FFEE00] font-label-caps uppercase text-[11px] font-black tracking-widest hover:bg-[#FFEE00] hover:text-black transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                    AÑADIR AL PEDIDO
                  </button>
                </div>
              </div>
              <div
                className="bg-[#141414] border border-white/5 overflow-hidden group hover:border-white/20 transition-all duration-300">
                <div className="h-56 relative overflow-hidden bg-black">
                  <img alt="Bicycle Chain"
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgDesLT81Bj8UVk0Q-GzkR_atYM0C4TBjeJzFP87A0bfjX_wy_ZlV9rmKJyBUd62ZTk-M8CqdT7pjn1H3jtJMxP2ria-66Jkr0liaTohGdZMqGb-HNYcUc97xJxl_a7Po41bnDltthjRrmRHHe5wRPZsfKmn-JhPfRkVZlpPt2qi9Q82s62ayXX5cqOjCuuz7MTrXgpIe-az5Nakjd7PqIhJacM-22CjqpjchNBWH15pjZOMAI-IKh7WTLlEtnUzBF4d_mcNoiy_mm" />
                  <div
                    className="absolute top-3 right-3 bg-black/80 backdrop-blur px-2 py-1 text-[10px] font-data-mono text-[#FFEE00] border border-[#FFEE00]/30">
                    STOCK: 20</div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-headline-md text-white uppercase italic-title tracking-tight">
                        KMC DLC11 Chain</h3>
                      <p className="text-[10px] text-white/40 uppercase font-label-caps mt-1">Ref:
                        KM-DLC11-B</p>
                    </div>
                    <span className="font-data-mono text-[#FFEE00] text-lg">$120.00</span>
                  </div>
                  <button
                    className="w-full py-4 bg-transparent border border-[#FFEE00] text-[#FFEE00] font-label-caps uppercase text-[11px] font-black tracking-widest hover:bg-[#FFEE00] hover:text-black transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                    AÑADIR AL PEDIDO
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Right Column (Sticky Panel) */}
          <aside className="p-10 xl:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Client Details Panel */}
              <div className="bg-[#141414] border border-white/10 p-6 relative">
                <div className="absolute left-0 top-6 w-1 h-4 bg-[#FFEE00]"></div>
                <div className="flex justify-between items-center mb-6 pl-4">
                  <h2
                    className="font-label-caps text-[#FFEE00] uppercase text-[11px] tracking-widest font-black">
                    DETALLES DEL PROVEEDOR</h2>
                  <button
                    className="text-[9px] font-label-caps text-white/40 hover:text-[#FFEE00] border border-white/10 px-2 py-1 transition-all uppercase">BUSCAR
                    OTRO</button>
                </div>
                <div className="bg-black/40 border border-white/5 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#FFEE00] text-sm">business</span>
                    <div className="text-xs font-bold text-white uppercase tracking-tight">Shimano
                      Distribution Iberia</div>
                  </div>
                  <div className="flex items-center gap-3 text-white/40">
                    <span className="material-symbols-outlined text-xs">mail</span>
                    <span className="text-[10px] font-data-mono">orders@shimano-dist.com</span>
                  </div>
                </div>
              </div>
              {/* Cart Panel */}
              <div
                className="bg-[#141414] border border-white/10 p-6 flex flex-col max-h-[calc(100vh-320px)] relative">
                <div className="absolute left-0 top-6 w-1 h-4 bg-[#FFEE00]"></div>
                <div className="flex justify-between items-center mb-6 pl-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#FFEE00] text-lg">shopping_cart</span>
                    <h2
                      className="font-label-caps text-white uppercase text-[11px] tracking-widest font-black">
                      CARRITO ACTIVO</h2>
                  </div>
                  <button
                    className="text-[9px] font-label-caps text-red-400/60 hover:text-red-400 uppercase tracking-widest transition-all">Limpiar
                    Todo</button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-6">
                  {/* Cart Items (Simplified for brevity) */}
                  <div className="bg-black/30 border border-white/5 p-3 flex gap-4 group">
                    <div
                      className="w-12 h-12 bg-black overflow-hidden shrink-0 border border-white/10">
                      <img alt="item" className="w-full h-full object-cover opacity-60"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwiFU1-VTPAfeFIwlBWV1g8Q8OJ47vlbnrlo9drkGxtR0HuGmawiCDwDNeK9h9Ib56gdxoYiOtnt6LepvmB-bEooaRTeE9zMySWlTvCdRI8iLKnE6kabfiz2uU8KJNkk-aYA__Yhx5zWGm4m66csiiVGnzj0jiGx77kaan7MOrNcWkNrOizJUUUWb5i6vNQos351LROMExpI5djrNx6RK6peNxVIDIoZaf8F3hoB9HkN3ZmW4YlJv_0iLdzTeTGqzxi8aStSGXaOj3" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div className="text-[10px] font-black uppercase text-white tracking-tight">
                          Ultegra Groupset</div>
                        <button
                          className="material-symbols-outlined text-white/20 hover:text-red-500 text-sm transition-all">delete</button>
                      </div>
                      <div className="flex justify-between items-end mt-2">
                        <div className="flex items-center bg-black/50 border border-white/10">
                          <button
                            className="px-2 py-0.5 text-white/40 hover:text-[#FFEE00]">-</button>
                          <span
                            className="px-2 text-[10px] font-data-mono text-white border-x border-white/10">02</span>
                          <button
                            className="px-2 py-0.5 text-white/40 hover:text-[#FFEE00]">+</button>
                        </div>
                        <span className="text-[10px] font-data-mono text-[#FFEE00]">$2,498.00</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex justify-between items-center py-4 border-y border-white/5">
                    <span
                      className="font-label-caps text-white uppercase text-[12px] font-black tracking-widest">TOTAL</span>
                    <span
                      className="font-data-mono text-[#FFEE00] text-3xl font-black italic-title tracking-tighter">$4,638.62</span>
                  </div>
                  <button
                    className="w-full bg-[#FFEE00] text-black font-label-caps font-black py-5 uppercase text-[13px] tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-xl">payments</span>
                    PROCESAR PEDIDO (POS)
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      {/* Mobile Bottom Navigation */}
      <nav
        className="md:hidden fixed bottom-0 left-0 w-full bg-[#0a0a0a] border-t border-white/10 flex justify-around items-center h-16 z-50">
        <a className="flex flex-col items-center text-[#FFEE00]" href="#">
          <span className="material-symbols-outlined">menu_book</span>
          <span className="text-[9px] font-label-caps uppercase mt-1">Catalog</span>
        </a>
        <a className="flex flex-col items-center text-white/40" href="#">
          <span className="material-symbols-outlined">history</span>
          <span className="text-[9px] font-label-caps uppercase mt-1">History</span>
        </a>
        <div className="-mt-10 bg-[#FFEE00] p-4 rounded-full border-4 border-[#0a0a0a] shadow-lg">
          <span className="material-symbols-outlined text-black">shopping_cart</span>
        </div>
        <a className="flex flex-col items-center text-white/40" href="#">
          <span className="material-symbols-outlined">analytics</span>
          <span className="text-[9px] font-label-caps uppercase mt-1">Report</span>
        </a>
        <a className="flex flex-col items-center text-white/40" href="#">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[9px] font-label-caps uppercase mt-1">Account</span>
        </a>
      </nav>
    </div>
  );
}
export default Compras;
