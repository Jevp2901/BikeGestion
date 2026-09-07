import { Link } from 'react-router-dom';
import { useState } from 'react';
import LogoMarca from './LogoMarca';
import { API_BASE_URL } from '../utils/sesion';

function RecuperarContrasena() {
  const [correo, setCorreo] = useState('');
  const [state, setState] = useState({ loading: false, error: '', success: '' });

  const submit = async (event) => {
    event.preventDefault();
    setState({ loading: true, error: '', success: '' });
    try {
      const response = await fetch(`${API_BASE_URL}/recuperar-contrasena/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ correo }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No fue posible enviar las instrucciones.');
      setState({ loading: false, error: '', success: data.mensaje });
    } catch (error) {
      setState({ loading: false, error: error.message, success: '' });
    }
  };

  return (
    <div className="min-h-screen bg-black font-body text-white">
      <header className="fixed top-0 z-50 flex h-20 w-full items-center justify-between border-b border-white/5 bg-black/70 px-6 backdrop-blur-xl md:px-8">
        <LogoMarca subtitle />
        <Link
          to="/inicio_sesion"
          className="font-headline text-sm uppercase tracking-[0.35em] text-white/65 transition-colors hover:text-yellow-300"
        >
          Volver
        </Link>
      </header>

      <main className="relative flex min-h-screen items-center justify-center px-4 pt-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-yellow-300/8 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[18rem] w-[18rem] rounded-full bg-white/5 blur-[100px]" />
        </div>

        <section className="relative z-10 w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/45">Recuperacion de acceso</p>
          <h1 className="mt-3 text-4xl font-black italic uppercase tracking-tight text-white">
            Olvidaste tu <span className="text-yellow-300">contraseña</span>
          </h1>
          <p className="mt-4 text-sm leading-6 text-white/70">
            Te enviaremos un enlace seguro para restablecer tu acceso. El enlace será válido durante 30 minutos.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label className="ml-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/55">
                Correo electronico
              </label>
              <input
                type="email"
                placeholder="usuario@correo.com"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                required
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white placeholder:text-white/25 transition duration-300 focus:border-yellow-300/60 focus:outline-none focus:ring-2 focus:ring-yellow-300/20"
              />
            </div>

            <button
              type="submit"
              disabled={state.loading}
              className="flex w-full items-center justify-center rounded-2xl bg-yellow-300 px-6 py-4 font-black uppercase tracking-[0.3em] text-black shadow-[0_18px_40px_rgba(253,224,71,0.22)] transition-all hover:-translate-y-0.5"
            >
              {state.loading ? 'Enviando...' : 'Enviar instrucciones'}
            </button>
            {state.error && <p className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{state.error}</p>}
            {state.success && <p className="rounded-xl border border-green-400/20 bg-green-400/10 p-3 text-sm text-green-200">{state.success}</p>}
          </form>

          <Link
            to="/inicio_sesion"
            className="mt-6 block text-center text-sm uppercase tracking-[0.3em] text-white/55 transition-colors hover:text-yellow-300"
          >
            Volver al inicio de sesion
          </Link>
        </section>
      </main>
    </div>
  );
}

export default RecuperarContrasena;
