import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerSesion } from "../utils/sesion";
import "../App.css";

function Dashboard() {
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        setUsuario(obtenerSesion());
    }, []);

    if (!usuario) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-white text-xl">Cargando...</p>
            </div>
        );
    }

    const rolId = Number(usuario.rol);

    return (
        <>
            <section className="mb-12">
                <h2 className="kinetic-headline text-4xl mb-2 text-primary-container uppercase">
                    Bienvenido, {usuario.nombre}
                </h2>
                <p className="text-on-surface-variant font-light max-w-2xl">
                    La tienda está operativa. Gestiona tu empresa de bicicletas con precisión quirúrgica.
                </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="surface-container-low p-6 rounded-xl flex flex-col justify-between group hover:surface-container-high transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Rol</span>
                        <span className="material-symbols-outlined text-primary-container">badge</span>
                    </div>
                    <div className="mb-4">
                        <div className="text-2xl font-black italic text-on-surface tracking-tighter">
                            {rolId === 2 ? 'Admin' : rolId === 1 ? 'Empleado' : 'Usuario'}
                        </div>
                        <div className="text-[10px] text-on-surface-variant mt-2">ID: {usuario.id}</div>
                    </div>
                </div>
                <div className="surface-container-low p-6 rounded-xl flex flex-col justify-between hover:surface-container-high transition-colors border-l-2 border-primary-container">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Email</span>
                        <span className="material-symbols-outlined text-primary-container">mail</span>
                    </div>
                    <div className="text-sm font-black italic text-on-surface tracking-tighter break-all">{usuario.correo}</div>
                </div>
                <div className="surface-container-low p-6 rounded-xl flex flex-col justify-between hover:surface-container-high transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Teléfono</span>
                        <span className="material-symbols-outlined text-primary-container">call</span>
                    </div>
                    <div className="text-lg font-black italic text-on-surface tracking-tighter">{usuario.telefono || 'No registrado'}</div>
                </div>
                <div className="surface-container-low p-6 rounded-xl flex flex-col justify-between hover:surface-container-high transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Dirección</span>
                        <span className="material-symbols-outlined text-primary-container">location_on</span>
                    </div>
                    <div className="text-sm font-black italic text-on-surface tracking-tighter break-all">{usuario.direccion || 'No registrada'}</div>
                </div>
            </div>

            <section className="mb-12">
                <h3 className="kinetic-headline text-xl text-on-surface uppercase tracking-tight mb-6">Accesos Rápidos</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Link to="/inventario" className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors text-center">
                        <div className="text-4xl mb-3">📦</div>
                        <p className="text-white font-semibold">Inventario</p>
                    </Link>
                    <Link to="/empleados" className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors text-center">
                        <div className="text-4xl mb-3">👥</div>
                        <p className="text-white font-semibold">Empleados</p>
                    </Link>
                    <Link to="/venta" className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors text-center">
                        <div className="text-4xl mb-3">💰</div>
                        <p className="text-white font-semibold">Ventas</p>
                    </Link>
                    <Link to="/reportes" className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors text-center">
                        <div className="text-4xl mb-3">📊</div>
                        <p className="text-white font-semibold">Reportes</p>
                    </Link>
                </div>
            </section>
        </>
    );
}

export default Dashboard;
