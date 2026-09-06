import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL, guardarSesion } from '../utils/sesion';
import LogoMarca from './LogoMarca';
import '../App.css'

const API_REGISTRO_URL = `${API_BASE_URL}/registrar/`;

const initialFormData = {
    nombre_usuario: '',
    id_rol: '',
    telefono: '',
    correo: '',
    direccion: '',
    contrasena: '',
    contrasena_confirmacion: ''
};

const validarRegistro = (data) => {
    const errores = {};
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefonoDigits = data.telefono.replace(/\D/g, '');

    if (data.nombre_usuario.trim().length < 3) {
        errores.nombre_usuario = 'Ingresa al menos 3 caracteres.';
    }
    if (!data.id_rol || Number(data.id_rol) <= 0) {
        errores.id_rol = 'Selecciona un rol válido.';
    }
    if (telefonoDigits.length < 7 || telefonoDigits.length > 15) {
        errores.telefono = 'El teléfono debe tener entre 7 y 15 dígitos.';
    }
    if (!correoRegex.test(data.correo.trim())) {
        errores.correo = 'Ingresa un correo válido.';
    }
    if (data.direccion.trim().length < 5) {
        errores.direccion = 'Ingresa una dirección más completa.';
    }
    if (
        data.contrasena.length < 8 ||
        !/[A-Z]/.test(data.contrasena) ||
        !/[a-z]/.test(data.contrasena) ||
        !/\d/.test(data.contrasena)
    ) {
        errores.contrasena = 'Usa mínimo 8 caracteres con mayúscula, minúscula y número.';
    }
    if (data.contrasena !== data.contrasena_confirmacion) {
        errores.contrasena_confirmacion = 'Las contraseñas no coinciden.';
    }

    return errores;
};

const normalizarErroresApi = (errores = {}) => {
    return Object.entries(errores).reduce((acc, [campo, mensajes]) => {
        acc[campo] = Array.isArray(mensajes) ? mensajes.join(' ') : String(mensajes);
        return acc;
    }, {});
};

function Registro() {
    const [formData, setFormData] = useState(initialFormData);
    const [fieldErrors, setFieldErrors] = useState({});
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
        setFieldErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const erroresCliente = validarRegistro(formData);

        if (Object.keys(erroresCliente).length > 0) {
            setFieldErrors(erroresCliente);
            setError('Revisa los campos resaltados antes de continuar.');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                nombre_usuario: formData.nombre_usuario.trim(),
                id_rol: Number(formData.id_rol),
                telefono: formData.telefono.trim(),
                correo: formData.correo.trim().toLowerCase(),
                direccion: formData.direccion.trim(),
                contrasena: formData.contrasena,
                contrasena_confirmacion: formData.contrasena_confirmacion,
            };

            const response = await fetch(API_REGISTRO_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const contentType = response.headers.get('content-type') || '';
            let data = {};

            if (contentType.includes('application/json')) {
                data = await response.json();
            } else {
                throw new Error(
                    response.status >= 500
                        ? 'El servidor no pudo guardar el registro. Verifica que MySQL esté iniciado en XAMPP.'
                        : 'El servidor respondió con un error inesperado.'
                );
            }

            if (response.ok && data.usuario) {
                guardarSesion(data.usuario);
                setSuccess('Registro completado. Entrando al dashboard...');
                setFormData(initialFormData);
                navigate('/dashboard', { replace: true });
            } else {
                setFieldErrors(normalizarErroresApi(data.errores));
                setError(data.mensaje || 'Error en el registro.');
            }
        } catch (err) {
            setError(err.message || 'No se pudo conectar con el servidor. Verifica la conexión.');
        } finally {
            setLoading(false);
        }
    };

    const fieldClass = (name) => `w-full bg-background/50 border rounded-lg px-4 py-3 text-sm text-white focus:ring-0 transition-all ${
        fieldErrors[name] ? 'border-red-400' : 'border-white/10'
    }`;

    const FieldError = ({ name }) => (
        fieldErrors[name] ? <p className="text-red-300 text-xs mt-1">{fieldErrors[name]}</p> : null
    );

    return (
    <div className=" bg-black text-on-background font-body min-h-screen flex flex-col relative overflow-x-hidden">
      {/*Navegación Superior*/}
      <header className="fixed top-0 w-full h-20 bg-background/80 backdrop-blur-xl z-50 flex justify-between items-center px-8 border-b border-white/5">
          <LogoMarca subtitle />
          <Link to="/" className="font-headline uppercase tracking-[0.35em] text-sm text-white/70 hover:text-yellow-300 transition-colors duration-200">Home</Link>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4">
          <div className="rounded-xl border border-white/10 bg-white/5 max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 glass-card overflow-hidden shadow-2xl">
              {/* Panel Izquierdo: Branding */}
              <div className="relative hidden lg:flex flex-col overflow-hidden p-12 justify-end bg-linear-to-br from-surface-variant to-background">
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                      <img src="https://sportpasioncycling.com/blog/wp-content/uploads/2024/05/ZERO-SLR-WILIER.jpg" className="w-full h-full object-cover grayscale" alt="Bike background" />
                  </div>
                  <div className="relative z-10">
                      <div className="mb-4">
                        <LogoMarca subtitle />
                      </div>
                      <p className="text-on-surface-variant text-sm max-w-xs mb-8">Eleva tu rendimiento. Gestiona tu empresa de ciclismo con precisión quirúrgica.</p>
                      <div className="flex items-center gap-4">
                          <div className="h-1 w-12 bg-primary"></div>
                          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Registrate y disfruta de tu experiencia</span>
                      </div>
                  </div>
              </div>

              {/* Panel Derecho: Formulario */}
              <div className="p-8 md:p-12 bg-surface/40">
                  <div className="mb-8">
                      <h2 className="headline-kinetic text-3xl text-white uppercase italic">Registro de <span className="text-yellow-300">Usuario</span></h2>
                      <p className="text-white text-sm mt-2 tracking-widest">Administra tu tienda de bicicletas</p>
                  </div>

                  {error && (
                      <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
                          {error}
                      </div>
                  )}
                  {success && (
                      <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-300 text-sm">
                          {success}
                      </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Nombre */}
                          <div className="space-y-1.5">
                              <label className="text-white flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                                  <span className="material-symbols-outlined text-sm">person</span> Nombre Completo
                              </label>
                              <input type="text" name="nombre_usuario" placeholder="Nombre" value={formData.nombre_usuario} onChange={handleChange} className={fieldClass('nombre_usuario')} autoComplete="name" required/>
                              <FieldError name="nombre_usuario" />
                          </div>
                          {/* Rol */}
                          <div className="space-y-1.5">
                              <label className="text-white flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                                  <span className="material-symbols-outlined text-sm">badge</span> Rol (ID)
                              </label>
                              <select name="id_rol" value={formData.id_rol} onChange={handleChange} className={fieldClass('id_rol')} required>
                                  <option className="bg-black" value="">Selecciona un rol</option>
                                  <option className="bg-black" value="1">Vendedor</option>
                                  <option className="bg-black" value="2">Administrador</option>
                                  <option className="bg-black" value="3">Mecanico</option>
                              </select>
                              <FieldError name="id_rol" />
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Teléfono */}
                          <div className="space-y-1.5">
                              <label className="text-white flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                                  <span className="material-symbols-outlined text-sm">call</span> Teléfono
                              </label>
                              <input type="tel" name="telefono" placeholder="+57 300 000 0000" value={formData.telefono} onChange={handleChange} className={fieldClass('telefono')} autoComplete="tel" required/>
                              <FieldError name="telefono" />
                          </div>
                          {/* Correo */}
                          <div className="space-y-1.5">
                              <label className="text-white flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                                  <span className="material-symbols-outlined text-sm">mail</span> Correo Electrónico
                              </label>
                              <input type="email" name="correo" placeholder="juan@velocity.com" value={formData.correo} onChange={handleChange} className={fieldClass('correo')} autoComplete="email" required/>
                              <FieldError name="correo" />
                          </div>
                      </div>

                      {/* Dirección */}
                      <div className="space-y-1.5">
                          <label className="text-white flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                              <span className="material-symbols-outlined text-sm">location_on</span> Dirección
                          </label>
                          <input type="text" name="direccion" placeholder="Dirección de la tienda" value={formData.direccion} onChange={handleChange} className={fieldClass('direccion')} autoComplete="street-address" required/>
                          <FieldError name="direccion" />
                      </div>

                      {/* Contraseña */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                              <label className="text-white flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                                  <span className="material-symbols-outlined text-sm">lock</span> Contraseña
                              </label>
                              <input type="password" name="contrasena" placeholder="Mínimo 8 caracteres" value={formData.contrasena} onChange={handleChange} className={fieldClass('contrasena')} autoComplete="new-password" required/>
                              <FieldError name="contrasena" />
                          </div>
                          <div className="space-y-1.5">
                              <label className="text-white flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                                  <span className="material-symbols-outlined text-sm">verified_user</span> Confirmar
                              </label>
                              <input type="password" name="contrasena_confirmacion" placeholder="Repite la contraseña" value={formData.contrasena_confirmacion} onChange={handleChange} className={fieldClass('contrasena_confirmacion')} autoComplete="new-password" required/>
                              <FieldError name="contrasena_confirmacion" />
                          </div>
                      </div>

                      {/* Botón de Registro */}
                      <button id="register-btn" type="submit" disabled={loading} className="block w-full bg-yellow-300 text-black py-4 px-6 rounded-lg font-headline font-black uppercase italic text-lg shadow-[0_8px_32px_rgba(253,224,26,0.2)] hover:shadow-[0_12px_48px_rgba(253,224,26,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all mt-6 text-center disabled:opacity-50 disabled:cursor-not-allowed">
                          {loading ? 'Registrando...' : 'Registrar'}
                      </button>
                      <p className="text-white text-sm mt-2 tracking-widest">¿Ya tienes cuenta?</p>
                      
                     <Link to="/inicio_sesion" className="block w-full bg-white text-black py-4 px-6 mt-6 rounded-lg font-headline font-black italic uppercase text-lg shadow-[0_8px_32px_rgba(253,224,26,0.2)] hover:shadow-[0_12px_48px_rgba(253,224,26,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all text-center">Iniciar <span className="text-yellow-400">Sesión</span></Link>
                      
                  </form>
              </div>
          </div>
      </main>
      {/* Elementos Decorativos de Fondo */}
      <div className="fixed top-0 right-0 -z-10 w-150 h-150 bg-primary/5 blur-[120px] rounded-full pointer-events-none opacity-50"></div>
      <div className="fixed bottom-0 left-0 -z-10 w-100 h-100 bg-white/5 blur-[100px] rounded-full pointer-events-none opacity-30"></div>
  </div>
  )
}
export default Registro;
