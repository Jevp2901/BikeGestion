import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../utils/sesion';
import LogoMarca from './LogoMarca';

function RestablecerContrasena() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({ contrasena: '', contrasena_confirmacion: '' });
  const [state, setState] = useState({ loading: false, error: '', success: '' });

  const submit = async (event) => {
    event.preventDefault();
    setState({ loading: true, error: '', success: '' });
    try {
      const response = await fetch(`${API_BASE_URL}/restablecer-contrasena/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: params.get('token'), ...form }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No fue posible cambiar la contraseña.');
      setState({ loading: false, error: '', success: data.mensaje });
    } catch (error) {
      setState({ loading: false, error: error.message, success: '' });
    }
  };

  return <div className="min-h-screen bg-black font-body text-white"><header className="fixed top-0 z-50 flex h-20 w-full items-center justify-between border-b border-white/5 bg-black/70 px-6 backdrop-blur-xl md:px-8"><LogoMarca subtitle /><Link to="/inicio_sesion" className="font-headline text-sm uppercase tracking-[0.35em] text-white/65 hover:text-yellow-300">Volver</Link></header><main className="relative flex min-h-screen items-center justify-center px-4 pt-24"><section className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl md:p-12"><p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/45">Nuevo acceso</p><h1 className="mt-3 text-4xl font-black italic uppercase tracking-tight">Crea tu <span className="text-yellow-300">contraseña</span></h1><form onSubmit={submit} className="mt-8 space-y-5"><input required minLength="8" type="password" placeholder="Nueva contraseña" value={form.contrasena} onChange={(e) => setForm({ ...form, contrasena: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white placeholder:text-white/25 focus:border-yellow-300/60 focus:outline-none" /><input required minLength="8" type="password" placeholder="Confirma tu contraseña" value={form.contrasena_confirmacion} onChange={(e) => setForm({ ...form, contrasena_confirmacion: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white placeholder:text-white/25 focus:border-yellow-300/60 focus:outline-none" />{state.error && <p className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{state.error}</p>}{state.success && <p className="rounded-xl border border-green-400/20 bg-green-400/10 p-3 text-sm text-green-200">{state.success} <Link className="font-bold underline" to="/inicio_sesion">Iniciar sesión</Link></p>}<button disabled={state.loading} className="w-full rounded-2xl bg-yellow-300 px-6 py-4 font-black uppercase tracking-[0.25em] text-black disabled:opacity-50">{state.loading ? 'Guardando...' : 'Cambiar contraseña'}</button></form></section></main></div>;
}

export default RestablecerContrasena;
