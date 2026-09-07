import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL, guardarSesion } from '../utils/sesion';
import LogoMarca from './LogoMarca';
import '../App.css';

function InicioSesion() {
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    contrasena: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre_usuario: formData.nombre_usuario.trim(),
          contrasena: formData.contrasena,
        })
      });

      const contentType = response.headers.get('content-type') || '';
      let data = {};

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        throw new Error(
          response.status >= 500
            ? 'El servidor no pudo iniciar sesión. Verifica que MySQL esté iniciado en XAMPP.'
            : 'El servidor respondió con un error inesperado.'
        );
      }

      if (response.ok && data.usuario) {
        localStorage.setItem('ultimo_acceso', new Date().toISOString());
        guardarSesion(data.usuario);
        setSuccess('¡Bienvenido! Redirigiendo...');
        navigate('/dashboard', { replace: true });
      } else {
        setError(data.error || 'Error en el inicio de sesión');
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-black font-body text-white selection:bg-yellow-300 selection:text-black">
      <header className="fixed top-0 z-50 flex h-20 w-full items-center justify-between border-b border-white/5 bg-black/70 px-6 backdrop-blur-xl md:px-8">
        <LogoMarca subtitle />
        <Link to="/" className="font-headline text-sm uppercase tracking-[0.35em] text-white/65 transition-colors duration-200 hover:text-yellow-300">
          Home
        </Link>
      </header>

      <main className="relative flex grow items-center justify-center px-4 pb-12 pt-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-10 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-yellow-300/8 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[24rem] w-[24rem] rounded-full bg-white/5 blur-[110px]" />
          <div className="absolute left-0 top-1/2 h-px w-full rotate-[-6deg] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <section className="z-10 w-full max-w-6xl">
          <div className="grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_30px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
            <aside className="relative flex min-h-[280px] flex-col justify-between overflow-hidden border-b border-white/5 bg-[#090909] p-8 md:p-10 lg:min-h-[640px] lg:border-b-0 lg:border-r">
              <div className="absolute inset-0">
                <img
                  src="/assets/logo-bicicleta.png"
                  alt="Bike Gestion"
                  className="absolute right-[-3rem] top-12 h-72 w-72 object-contain opacity-10 blur-[1px]"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(253,224,71,0.16),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_32%)]" />
              </div>

              <div className="relative z-10 max-w-md">
                <LogoMarca subtitle />
                <p className="mt-6 text-3xl font-black italic uppercase leading-tight text-white md:text-5xl">
                  Control total para tu
                  <span className="block text-yellow-300">tienda de bicicletas</span>
                </p>
                <p className="mt-5 max-w-sm text-sm leading-6 text-white/70 md:text-base">
                  Accede a inventario, ventas, compras y usuarios desde una interfaz mas clara, rapida y profesional.
                </p>
              </div>

              <div className="relative z-10 mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-white/45">Seguridad</p>
                  <p className="mt-2 text-sm font-semibold text-white">Ingreso protegido</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-white/45">Velocidad</p>
                  <p className="mt-2 text-sm font-semibold text-white">Acceso rapido</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-white/45">Soporte</p>
                  <p className="mt-2 text-sm font-semibold text-white">Recuperacion asistida</p>
                </div>
              </div>
            </aside>

            <div className="p-8 md:p-12 lg:p-14">
              <header className="mb-10">
                <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/45">Acceso al sistema</p>
                <h1 className="mt-3 text-4xl font-black italic uppercase tracking-tight text-white md:text-5xl">
                  Inicio de <span className="text-yellow-300">sesion</span>
                </h1>
                <p className="mt-4 max-w-lg text-sm leading-6 text-white/70">
                  Inicia sesion para administrar tu tienda con un flujo mas limpio, elegante y facil de usar.
                </p>
              </header>

              {error && (
                <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-6 rounded-2xl border border-green-500/40 bg-green-500/10 p-4 text-sm text-green-200">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/55">
                    Nombre de usuario
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35">
                      person
                    </span>
                    <input
                      className="w-full rounded-2xl border border-white/10 bg-black/40 py-4 pl-12 pr-4 text-white placeholder:text-white/25 transition duration-300 focus:border-yellow-300/60 focus:outline-none focus:ring-2 focus:ring-yellow-300/20"
                      placeholder="usuario"
                      type="text"
                      name="nombre_usuario"
                      value={formData.nombre_usuario}
                      onChange={handleChange}
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4 px-1">
                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-white/55">
                      Contraseña
                    </label>
                    <Link
                      className="text-[11px] font-semibold uppercase tracking-[0.3em] text-yellow-300/90 transition-colors hover:text-yellow-200"
                      to="/recuperar-contrasena"
                    >
                      Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35">
                      lock
                    </span>
                    <input
                      className="w-full rounded-2xl border border-white/10 bg-black/40 py-4 pl-12 pr-4 text-white placeholder:text-white/25 transition duration-300 focus:border-yellow-300/60 focus:outline-none focus:ring-2 focus:ring-yellow-300/20"
                      placeholder="••••••••"
                      type="password"
                      name="contrasena"
                      value={formData.contrasena}
                      onChange={handleChange}
                      autoComplete="current-password"
                      required
                    />
                  </div>
                </div>

                <button
                  className="group mt-2 flex w-full items-center justify-center gap-3 rounded-2xl bg-yellow-300 px-6 py-4 font-black uppercase tracking-[0.3em] text-black shadow-[0_18px_40px_rgba(253,224,71,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_55px_rgba(253,224,71,0.28)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Iniciando...' : 'Iniciar sesion'}
                  <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
                    east
                  </span>
                </button>
              </form>

              <footer className="mt-10 border-t border-white/8 pt-8 text-center">
                <p className="text-xs uppercase tracking-[0.35em] text-white/50">
                  ¿No tienes cuenta?
                  <Link to="/registro" className="ml-2 font-semibold text-yellow-300 transition-colors hover:text-yellow-200">
                    Registrate aqui
                  </Link>
                </p>
              </footer>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
export default InicioSesion;
