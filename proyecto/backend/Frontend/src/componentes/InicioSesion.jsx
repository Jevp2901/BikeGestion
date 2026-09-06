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
    <div className="bg-black font-body text-white text-on-surface selection:bg-primary-fixed selection:text-on-primary min-h-screen flex flex-col overflow-x-hidden">
      {/*Navegación Superior*/}
      <header className="fixed top-0 w-full h-20 bg-background/80 backdrop-blur-xl z-50 flex justify-between items-center px-8 border-b border-white/5">
          <LogoMarca subtitle />
           <Link to="/" className="font-headline uppercase tracking-[0.35em] text-sm text-white/70 hover:text-yellow-300 transition-colors duration-200">Home</Link>
      </header>
      {/* Main Content: Kinetic Login Canvas */}
      <main className="grow flex items-center justify-center px-4 pt-24 pb-12 relative">
        {/* Background Velocity Accents (Decorative) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary-fixed/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-primary-container/5 rounded-full blur-[100px]"></div>
          {/* Asymmetric Speed Line */}
          <div
            className="absolute top-1/2 left-0 w-full h-px bg-linear-60-to-r from-transparent via-primary-fixed/10 to-transparent rotate-[-5deg]">
          </div>
        </div>
        <section className="w-full max-w-120 z-10">
          {/* Login Card */}
          <div className="rounded-4xl border border-white/10 bg-white/5 glass-panel border-t border-primary-fixed/20 stealth-shadow p-8 md:p-12">
            <header className="mb-10">
              <h2 className="font-headline font-bold italic text-4xl tracking-tighter leading-tight mb-2">
                INICIO DE <span className="text-yellow-300 text-primary-fixed">SESIÓN</span>
              </h2>
              <p className="text-on-surface-variant font-label text-sm uppercase tracking-wide">Inicia sesión para
                gestionar tu tienda de una mejor manera</p>
            </header>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-300 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Input: Identificación */}
              <div className="space-y-2">
                <label
                  className="font-label text-xs uppercase tracking-widest text-on-surface-variant ml-1">
                  Nombre de Usuario:</label>
                <div className="relative group">
                  <input 
                    className="w-full bg-surface-container-highest border-none rounded-xl py-4 pl-12 pr-4 text-on-surface 
                    placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary-fixed/40 transition-all duration-300"
                    placeholder="usuario" 
                    type="text"
                    name="nombre_usuario"
                    value={formData.nombre_usuario}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              {/* Input: Clave de Acceso */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                    Contraseña:</label>
                  <a className="text-yellow-200 font-label text-[10px] uppercase tracking-tighter text-primary-fixed/70 hover:text-primary-fixed transition-colors"
                    href="#">¿Olvidaste tu contraseña?</a>
                </div>
                <div className="relative group">
                  <input
                    className="w-full bg-surface-container-highest border-none rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary-fixed/40 transition-all duration-300"
                    placeholder="••••••••" 
                    type="password"
                    name="contrasena"
                    value={formData.contrasena}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              {/* Action Button */}
              <div className="pt-4">
                <button
                  className=" bg-white kinetic-gradient w-full py-4 rounded-xl flex items-center justify-center gap-2 group hover:shadow-[0_0_20px_rgba(253,224,26,0.3)] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={loading}
                >
                  <span
                    className="text-black font-headline font-bold italic uppercase tracking-widest text-on-primary text-lg">
                    {loading ? 'INICIANDO...' : 'INICIAR'} <span className="text-yellow-400">SESION</span></span>
                  <span
                    className="material-symbols-outlined text-on-primary font-bold group-hover:translate-x-1 transition-transform">bolt</span>
                </button>
              </div>
            </form>
            {/* Footer Link */}
            <footer className="mt-10 pt-8 border-t border-outline-variant/10 text-center">
              <p className="text-on-surface-variant font-label text-xs uppercase tracking-widest">
                ¿No tienes cuenta?
                <Link to="/registro" className=" text-amber-300 text-primary-fixed font-bold hover:underline underline-offset-4 ml-1"
                  >Regístrate aquí</Link>
              </p>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
export default InicioSesion;
