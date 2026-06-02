import "../App.css";
function Inventario() {
  return (
    <div className="grid grid-cols-12 gap-8">
          {/* Sección de Encabezado de Inventario y Tabla */}
          <div className="col-span-12 lg:col-span-9 space-y-8">
            {/* Encabezado de Acción */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="headline-kinetic text-4xl text-on-background uppercase">Gestión de Inventario y Stock
                </h2>
                <p className="text-on-surface-variant font-medium mt-1">Telemetría en vivo para tu ecosistema de
                  piezas y bicicletas.</p>
              </div>
              <div className="flex gap-3">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-surface-container-highest/40 backdrop-blur-sm border border-outline-variant/15 text-on-surface font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-surface-container-highest transition-all">
                  <span className="material-symbols-outlined text-sm">publish</span>
                  Importar CSV
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-surface-container-highest/40 backdrop-blur-sm border border-outline-variant/15 text-on-surface font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-surface-container-highest transition-all">
                  <span className="material-symbols-outlined text-sm">print</span>
                  Imprimir Etiquetas
                </button>
                <button
                  className="flex items-center gap-2 px-5 py-2 bg-primary-container text-on-primary font-black text-xs uppercase tracking-widest rounded-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary-container/5">
                  <span className="material-symbols-outlined text-sm">add</span>
                  Nuevo Artículo
                </button>
              </div>
            </div>
            {/* Filtros y Búsqueda */}
            <div className="flex flex-col md:flex-row gap-4 bg-surface-container-low p-4 rounded-xl ghost-border">
              <div className="flex-1 relative">
                <span
                  className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                <input
                  className="w-full bg-surface-container-lowest border-none focus:ring-1 focus:ring-primary-container text-sm py-2.5 pl-10 rounded-lg text-on-surface placeholder:text-on-surface-variant/50 transition-all"
                  placeholder="Buscar artículos por nombre, código o categoría..." type="text" />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                <button
                  className="px-4 py-2 bg-primary-container/10 border border-primary-container text-primary-container text-xs font-bold rounded-lg whitespace-nowrap">Todos
                  los Artículos</button>
                <button
                  className="px-4 py-2 bg-surface-container-highest/50 border border-outline-variant/15 text-on-surface-variant text-xs font-bold rounded-lg hover:border-primary-container/40 transition-all whitespace-nowrap">Repuestos</button>
                <button
                  className="px-4 py-2 bg-surface-container-highest/50 border border-outline-variant/15 text-on-surface-variant text-xs font-bold rounded-lg hover:border-primary-container/40 transition-all whitespace-nowrap">Accesorios</button>
                <button
                  className="px-4 py-2 bg-surface-container-highest/50 border border-outline-variant/15 text-on-surface-variant text-xs font-bold rounded-lg hover:border-primary-container/40 transition-all whitespace-nowrap">Bicicletas</button>
              </div>
            </div>
            {/* Tabla de Datos */}
            <div className="bg-surface-container rounded-lg overflow-hidden ghost-border">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high">
                    <th
                      className="headline-kinetic p-4 text-xs uppercase tracking-widest text-on-surface-variant">
                      Código</th>
                    <th
                      className="headline-kinetic p-4 text-xs uppercase tracking-widest text-on-surface-variant">
                      Nombre</th>
                    <th
                      className="headline-kinetic p-4 text-xs uppercase tracking-widest text-on-surface-variant">
                      Categoría</th>
                    <th
                      className="headline-kinetic p-4 text-xs uppercase tracking-widest text-on-surface-variant text-right">
                      Stock</th>
                    <th
                      className="headline-kinetic p-4 text-xs uppercase tracking-widest text-on-surface-variant text-right">
                      Precio Unitario</th>
                    <th
                      className="headline-kinetic p-4 text-xs uppercase tracking-widest text-on-surface-variant">
                      Status</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {/* Fila 1 */}
                  <tr
                    className="bg-surface-container-low hover:bg-surface-container-highest/30 transition-colors">
                    <td className="p-4 text-xs font-mono text-on-surface-variant">BK-90210</td>
                    <td className="p-4">
                      <div className="font-bold text-on-surface">Specialized Turbo Vado 4.0</div>
                      <div className="text-[10px] text-on-surface-variant/60 uppercase font-black">Cuadro:
                        Aluminio • Talla: L</div>
                    </td>
                    <td className="p-4"><span
                      className="px-2 py-1 bg-surface-container-highest rounded text-[10px] font-extrabold uppercase text-on-surface-variant">Bicicletas</span>
                    </td>
                    <td className="p-4 text-right font-bold text-on-surface">12</td>
                    <td className="p-4 text-right font-bold text-on-surface">$3,450.00</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full bg-tertiary-fixed shadow-[0_0_8px_rgba(88,248,255,0.4)]"></span>
                        <span className="text-[10px] font-black uppercase text-tertiary-fixed">En
                          Stock</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-on-surface-variant hover:text-primary-container transition-all">
                        <span className="material-symbols-outlined text-lg">more_vert</span>
                      </button>
                    </td>
                  </tr>
                  {/* Fila 2 */}
                  <tr
                    className="bg-surface-container-lowest hover:bg-surface-container-highest/30 transition-colors">
                    <td className="p-4 text-xs font-mono text-on-surface-variant">RP-44521</td>
                    <td className="p-4">
                      <div className="font-bold text-on-surface">Cadena Shimano Ultegra</div>
                      <div className="text-[10px] text-on-surface-variant/60 uppercase font-black">11
                        Velocidades •
                        HG701</div>
                    </td>
                    <td className="p-4"><span
                      className="px-2 py-1 bg-surface-container-highest rounded text-[10px] font-extrabold uppercase text-on-surface-variant">Repuestos</span>
                    </td>
                    <td className="p-4 text-right font-bold text-error">4</td>
                    <td className="p-4 text-right font-bold text-on-surface">$45.00</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase text-error">Stock Bajo</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-on-surface-variant hover:text-primary-container transition-all">
                        <span className="material-symbols-outlined text-lg">more_vert</span>
                      </button>
                    </td>
                  </tr>
                  {/* Fila 3 */}
                  <tr
                    className="bg-surface-container-low hover:bg-surface-container-highest/30 transition-colors">
                    <td className="p-4 text-xs font-mono text-on-surface-variant">AC-11204</td>
                    <td className="p-4">
                      <div className="font-bold text-on-surface">Casco Giro Aether MIPS</div>
                      <div className="text-[10px] text-on-surface-variant/60 uppercase font-black">Negro Mate
                        • Grande</div>
                    </td>
                    <td className="p-4"><span
                      className="px-2 py-1 bg-surface-container-highest rounded text-[10px] font-extrabold uppercase text-on-surface-variant">Accesorios</span>
                    </td>
                    <td className="p-4 text-right font-bold text-on-surface">48</td>
                    <td className="p-4 text-right font-bold text-on-surface">$280.00</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-tertiary-fixed"></span>
                        <span className="text-[10px] font-black uppercase text-tertiary-fixed">En
                          Stock</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-on-surface-variant hover:text-primary-container transition-all">
                        <span className="material-symbols-outlined text-lg">more_vert</span>
                      </button>
                    </td>
                  </tr>
                  {/* Fila 4 */}
                  <tr
                    className="bg-surface-container-lowest hover:bg-surface-container-highest/30 transition-colors">
                    <td className="p-4 text-xs font-mono text-on-surface-variant">RP-99812</td>
                    <td className="p-4">
                      <div className="font-bold text-on-surface">Continental GP5000 S TR</div>
                      <div className="text-[10px] text-on-surface-variant/60 uppercase font-black">700x28c •
                        Negro</div>
                    </td>
                    <td className="p-4"><span
                      className="px-2 py-1 bg-surface-container-highest rounded text-[10px] font-extrabold uppercase text-on-surface-variant">Repuestos</span>
                    </td>
                    <td className="p-4 text-right font-bold text-on-surface-variant/40">0</td>
                    <td className="p-4 text-right font-bold text-on-surface">$95.00</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-surface-variant"></span>
                        <span className="text-[10px] font-black uppercase text-on-surface-variant/60">Sin
                          Stock</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-on-surface-variant hover:text-primary-container transition-all">
                        <span className="material-symbols-outlined text-lg">more_vert</span>
                      </button>
                    </td>
                  </tr>
                  {/* Fila 5 */}
                  <tr
                    className="bg-surface-container-low hover:bg-surface-container-highest/30 transition-colors">
                    <td className="p-4 text-xs font-mono text-on-surface-variant">BK-77212</td>
                    <td className="p-4">
                      <div className="font-bold text-on-surface">Trek Emonda SL 6</div>
                      <div className="text-[10px] text-on-surface-variant/60 uppercase font-black">Carmesí •
                        56cm</div>
                    </td>
                    <td className="p-4"><span
                      className="px-2 py-1 bg-surface-container-highest rounded text-[10px] font-extrabold uppercase text-on-surface-variant">Bicicletas</span>
                    </td>
                    <td className="p-4 text-right font-bold text-on-surface">3</td>
                    <td className="p-4 text-right font-bold text-on-surface">$4,200.00</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-tertiary-fixed"></span>
                        <span className="text-[10px] font-black uppercase text-tertiary-fixed">En
                          Stock</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-on-surface-variant hover:text-primary-container transition-all">
                        <span className="material-symbols-outlined text-lg">more_vert</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div
                className="p-4 flex justify-between items-center bg-surface-container-high/50 border-t border-outline-variant/10">
                <span className="text-xs text-on-surface-variant">Mostrando 1 a 5 de 124 artículos</span>
                <div className="flex gap-1">
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/10 hover:bg-primary-container/10 text-on-surface transition-all">
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded bg-primary-container text-on-primary font-bold text-xs">1</button>
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/10 hover:bg-primary-container/10 text-on-surface transition-all text-xs">2</button>
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/10 hover:bg-primary-container/10 text-on-surface transition-all">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Panel Lateral: Alertas de Stock */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <div className="bg-surface-container-high p-6 rounded-xl ghost-border relative overflow-hidden">
              {/* Decoración de Alto Rendimiento */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-container/5 rounded-full blur-3xl"></div>
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary-container"
                  style="font-variation-settings: 'FILL' 1;">warning</span>
                <h3 className="headline-kinetic text-xl uppercase text-on-surface">Alertas de Stock</h3>
              </div>
              <div className="space-y-4">
                {/* Elemento de Alerta */}
                <div className="p-4 bg-surface-container-lowest rounded-lg border-l-2 border-error">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase font-black text-on-surface-variant">Nivel
                      Crítico</span>
                    <span className="text-[10px] font-mono text-error">Solo quedan 2</span>
                  </div>
                  <h4 className="text-sm font-bold text-on-surface">Batería SRAM AXS</h4>
                  <p className="text-[11px] text-on-surface-variant mt-1">Se requiere reabastecimiento para
                    cumplir con las órdenes pendientes del taller.</p>
                  <button
                    className="mt-4 w-full py-2 bg-error/10 hover:bg-error/20 text-error text-[10px] font-black uppercase tracking-widest rounded transition-all">Reabastecer
                    Ahora</button>
                </div>
                {/* Elemento de Alerta */}
                <div className="p-4 bg-surface-container-lowest rounded-lg border-l-2 border-primary-container">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase font-black text-on-surface-variant">Advertencia de
                      Tendencia</span>
                    <span className="text-[10px] font-mono text-primary-container">4 unidades</span>
                  </div>
                  <h4 className="text-sm font-bold text-on-surface">Cadena Shimano Ultegra</h4>
                  <p className="text-[11px] text-on-surface-variant mt-1">La velocidad de ventas aumentó un 40%
                    esta semana.</p>
                  <button
                    className="mt-4 w-full py-2 bg-primary-container/10 hover:bg-primary-container/20 text-primary-container text-[10px] font-black uppercase tracking-widest rounded transition-all">Añadir
                    al Carrito</button>
                </div>
                {/* Alert Item */}
                <div className="p-4 bg-surface-container-lowest rounded-lg border-l-2 border-error">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase font-black text-on-surface-variant">Sin Stock</span>
                    <span className="text-[10px] font-mono text-error">0 unidades</span>
                  </div>
                  <h4 className="text-sm font-bold text-on-surface">Continental GP5000</h4>
                  <p className="text-[11px] text-on-surface-variant mt-1">3 pedidos pendientes esperando este
                    artículo.</p>
                  <button
                    className="mt-4 w-full py-2 bg-error/10 hover:bg-error/20 text-error text-[10px] font-black uppercase tracking-widest rounded transition-all">Compra
                    de Emergencia</button>
                </div>
              </div>
              {/* Estadísticas de Telemetría */}
              <div className="mt-8 pt-6 border-t border-outline-variant/10">
                <h5 className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant/50 mb-4">
                  Telemetría de Inventario</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-surface-container rounded-lg">
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase">Rotación</div>
                    <div className="text-xl headline-kinetic text-[#fde01a]">14.2%</div>
                  </div>
                  <div className="p-3 bg-surface-container rounded-lg">
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase">Valor</div>
                    <div className="text-xl headline-kinetic text-[#fde01a]">$142k</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Tarjeta de Información Rápida */}
            <div
              className="bg-linear-to-br from-primary-container to-[#e1c700] p-6 rounded-xl shadow-lg shadow-primary-container/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-on-primary rounded-lg">
                  <span className="material-symbols-outlined text-primary-container">bolt</span>
                </div>
                <span className="text-xs font-black uppercase tracking-tighter text-on-primary">Eficiencia de
                  Inventario</span>
              </div>
              <p className="text-on-primary font-bold text-sm leading-tight">Tu rotación de stock es un 12% más rápida
                que el mes pasado. Buen trabajo en la gestión de repuestos.</p>
            </div>
          </div>
        </div>
  );
}

export default Inventario;
