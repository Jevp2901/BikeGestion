import "../App.css";

function Ventas() {
    return (
        <div>
            <section className="mb-10">
                <h1 className="kinetic-headline text-3xl text-primary-container uppercase mb-2">
                    Ventas / Cotizaciones
                </h1>
                <p className="text-on-surface-variant font-light max-w-2xl">
                    Módulo de ventas y cotizaciones. Aquí podrás registrar ventas y generar presupuestos para clientes.
                </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="surface-container-low p-6 rounded-xl border border-white/10">
                    <span className="material-symbols-outlined text-[#fde01a] text-3xl mb-3">receipt_long</span>
                    <h2 className="text-white font-bold uppercase text-sm tracking-wider mb-2">Nueva cotización</h2>
                    <p className="text-white/60 text-sm">Crea un presupuesto para un cliente.</p>
                </div>
                <div className="surface-container-low p-6 rounded-xl border border-white/10">
                    <span className="material-symbols-outlined text-[#fde01a] text-3xl mb-3">point_of_sale</span>
                    <h2 className="text-white font-bold uppercase text-sm tracking-wider mb-2">Registrar venta</h2>
                    <p className="text-white/60 text-sm">Procesa una venta en mostrador.</p>
                </div>
                <div className="surface-container-low p-6 rounded-xl border border-white/10">
                    <span className="material-symbols-outlined text-[#fde01a] text-3xl mb-3">history</span>
                    <h2 className="text-white font-bold uppercase text-sm tracking-wider mb-2">Historial</h2>
                    <p className="text-white/60 text-sm">Consulta ventas y cotizaciones anteriores.</p>
                </div>
            </div>
        </div>
    );
}

export default Ventas;
