import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, guardarSesion, obtenerSesion } from '../utils/sesion';
import '../App.css';

const validarFormulario = (data) => {
  const errores = {};
  const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const telefonoDigits = data.telefono.replace(/\D/g, '');

  if (data.nombre_usuario.trim().length < 3) {
    errores.nombre_usuario = 'Ingresa al menos 3 caracteres.';
  } else if (data.nombre_usuario.trim().length > 50) {
    errores.nombre_usuario = 'El nombre de usuario no puede exceder los 50 caracteres.';
  }

  if (telefonoDigits.length < 7 || telefonoDigits.length > 15) {
    errores.telefono = 'El teléfono debe tener entre 7 y 15 dígitos.';
  } else if (data.telefono.trim().length > 20) {
    errores.telefono = 'El teléfono no puede exceder los 20 caracteres.';
  }

  if (!correoRegex.test(data.correo.trim())) {
    errores.correo = 'Ingresa un correo válido.';
  } else if (data.correo.trim().length > 50) {
    errores.correo = 'El correo no puede exceder los 50 caracteres.';
  }

  if (data.direccion.trim().length < 5) {
    errores.direccion = 'Ingresa una dirección más completa (mín. 5 caracteres).';
  } else if (data.direccion.trim().length > 50) {
    errores.direccion = 'La dirección no puede exceder los 50 caracteres.';
  }

  if (data.contrasena_actual || data.contrasena || data.contrasena_confirmacion) {
    if (!data.contrasena_actual) {
      errores.contrasena_actual = 'La contraseña actual es obligatoria para cambiarla.';
    }
    if (!data.contrasena) {
      errores.contrasena = 'La nueva contraseña es obligatoria.';
    } else if (
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
  }

  return errores;
};

const normalizarErroresApi = (errores = {}) => {
  return Object.entries(errores).reduce((acc, [campo, mensajes]) => {
    acc[campo] = Array.isArray(mensajes) ? mensajes.join(' ') : String(mensajes);
    return acc;
  }, {});
};

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

function EditarUsuario() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [usuarioSesion, setUsuarioSesion] = useState(null);
  const [formData, setFormData] = useState({
    id_usuario: '',
    nombre_usuario: '',
    telefono: '',
    direccion: '',
    correo: '',
    id_rol: '',
    contrasena_actual: '',
    contrasena: '',
    contrasena_confirmacion: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password visibility toggles
  const [mostrarContrasenaActual, setMostrarContrasenaActual] = useState(false);
  const [mostrarContrasenaNueva, setMostrarContrasenaNueva] = useState(false);
  const [mostrarContrasenaConfirmacion, setMostrarContrasenaConfirmacion] = useState(false);
  const contrasenaActualInputRef = useRef(null);

  // Profile photo states
  const [fotoPreview, setFotoPreview] = useState(null);
  const [fotoArchivo, setFotoArchivo] = useState(null);

  // Last access timestamp state
  const [ultimoAccesoText, setUltimoAccesoText] = useState('Sin registro de acceso');

  useEffect(() => {
    const sesion = obtenerSesion();
    if (!sesion) {
      navigate('/inicio_sesion', { replace: true });
      return;
    }
    setUsuarioSesion(sesion);

    // Read profile picture from localStorage
    const savedPhoto = localStorage.getItem(`foto_perfil_usuario_${sesion.id}`);
    if (savedPhoto) {
      setFotoPreview(savedPhoto);
    }

    // Read and format last access
    const lastAccess = localStorage.getItem('ultimo_acceso');
    if (lastAccess) {
      try {
        const date = new Date(lastAccess);
        const formatted = date.toLocaleString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        setUltimoAccesoText(formatted);
      } catch {
        setUltimoAccesoText(lastAccess);
      }
    } else {
      // Fallback: use current session date
      try {
        const date = new Date();
        const formatted = date.toLocaleString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        setUltimoAccesoText(formatted);
      } catch {
        // keep default
      }
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/usuario/${sesion.id}/`);
        if (response.ok) {
          const data = await response.json();
          if (data.usuario) {
            setFormData({
              id_usuario: data.usuario.id || '',
              nombre_usuario: data.usuario.nombre || '',
              telefono: data.usuario.telefono || '',
              direccion: data.usuario.direccion || '',
              correo: data.usuario.correo || '',
              id_rol: data.usuario.rol || '',
              contrasena_actual: '',
              contrasena: '',
              contrasena_confirmacion: '',
            });
          }
        } else {
          // fallback to local storage session data
          setFormData({
            id_usuario: sesion.id || '',
            nombre_usuario: sesion.nombre || '',
            telefono: sesion.telefono || '',
            direccion: sesion.direccion || '',
            correo: sesion.correo || '',
            id_rol: sesion.rol || '',
            contrasena_actual: '',
            contrasena: '',
            contrasena_confirmacion: '',
          });
        }
      } catch (err) {
        setFormData({
          id_usuario: sesion.id || '',
          nombre_usuario: sesion.nombre || '',
          telefono: sesion.telefono || '',
          direccion: sesion.direccion || '',
          correo: sesion.correo || '',
          id_rol: sesion.rol || '',
          contrasena_actual: '',
          contrasena: '',
          contrasena_confirmacion: '',
        });
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFieldErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const toggleMostrarContrasenaActual = () => {
    setMostrarContrasenaActual((prev) => !prev);
    requestAnimationFrame(() => {
      contrasenaActualInputRef.current?.focus();
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type: image/jpeg, image/png, image/webp
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Formato de imagen inválido. Solo se admiten JPG, PNG y WEBP.');
      return;
    }

    // Validate size: max 2MB
    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen es demasiado grande. El tamaño máximo permitido es 2 MB.');
      return;
    }

    setError('');
    setFotoArchivo(file);

    // Create immediate preview URL
    const previewUrl = URL.createObjectURL(file);
    setFotoPreview(previewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const erroresCliente = validarFormulario(formData);
    if (Object.keys(erroresCliente).length > 0) {
      setFieldErrors(erroresCliente);
      setError('Revisa los campos resaltados antes de guardar.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nombre_usuario: formData.nombre_usuario.trim(),
        telefono: formData.telefono.trim(),
        direccion: formData.direccion.trim(),
        correo: formData.correo.trim().toLowerCase(),
        id_rol: Number(formData.id_rol),
      };

      if (formData.contrasena_actual && formData.contrasena) {
        payload.contrasena_actual = formData.contrasena_actual;
        payload.contrasena = formData.contrasena;
        payload.contrasena_confirmacion = formData.contrasena_confirmacion;
      }

      const response = await fetch(`${API_BASE_URL}/usuario/${formData.id_usuario}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      let data = {};
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        throw new Error('El servidor respondió con un formato inesperado.');
      }

      if (response.ok && data.usuario) {
        // Save photo in localStorage if chosen
        const photoKey = `foto_perfil_usuario_${formData.id_usuario}`;
        if (fotoArchivo) {
          try {
            const base64Photo = await convertToBase64(fotoArchivo);
            localStorage.setItem(photoKey, base64Photo);
          } catch (photoErr) {
            console.error('Error al guardar la foto de perfil:', photoErr);
          }
        } else if (!fotoPreview) {
          // If deleted
          localStorage.removeItem(photoKey);
        }

        guardarSesion(data.usuario);
        setSuccess('Cambios guardados con éxito. Redirigiendo...');
        setFormData((prev) => ({
          ...prev,
          contrasena_actual: '',
          contrasena: '',
          contrasena_confirmacion: '',
        }));
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        if (data.errores) {
          setFieldErrors(normalizarErroresApi(data.errores));
        }
        setError(data.mensaje || 'Error al guardar los cambios.');
      }
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-6 py-12">
      <form onSubmit={handleSubmit} noValidate>
        {/* Encabezado */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant pb-8">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface uppercase italic mb-2 tracking-tight">
              Administrar Perfil de <span className="text-primary-container">Usuario</span>
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Gestiona tus datos personales y configuración de seguridad.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="bg-transparent border border-outline-variant text-on-surface font-label-md text-label-md uppercase px-8 py-3 hover:bg-surface-container transition-colors tracking-widest cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-container text-on-primary-fixed font-headline-md text-label-md uppercase px-8 py-3 hover:bg-[#FFE16D] transition-colors font-bold tracking-widest flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">save</span>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>

        {/* Mensajes de feedback */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Izquierda: Información Personal y Seguridad */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Card: Información Personal */}
            <div className="modular-card p-8 flex flex-col gap-8">
              <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
                <span className="material-symbols-outlined text-primary-container">person</span>
                <h3 className="font-label-md text-label-md text-primary-container uppercase tracking-widest font-bold">
                  Información Personal
                </h3>
              </div>

              {/* Subsección: Foto de Perfil */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-outline-variant/20">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-24 h-24 rounded-full border-2 border-primary-container bg-surface-container-highest overflow-hidden flex items-center justify-center cursor-pointer group"
                >
                  {fotoPreview ? (
                    <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-[#fde01a] text-4xl">account_circle</span>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#fde01a] text-2xl">photo_camera</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-label-sm text-label-sm text-on-surface uppercase font-bold">Foto de Perfil</span>
                  <p className="text-xs text-on-surface-variant max-w-xs">
                    Formatos admitidos: JPG, PNG o WEBP. Tamaño máximo: 2 MB.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-bold uppercase tracking-wider text-primary-container hover:text-yellow-300 transition-colors bg-transparent border border-outline-variant/50 px-3 py-1.5 rounded cursor-pointer"
                    >
                      Cambiar foto
                    </button>
                    {fotoPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setFotoPreview(null);
                          setFotoArchivo(null);
                        }}
                        className="text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors bg-transparent border border-red-500/30 px-3 py-1.5 rounded cursor-pointer"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Nombre */}
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                    Nombre Completo
                  </label>
                  <input
                    name="nombre_usuario"
                    type="text"
                    value={formData.nombre_usuario}
                    onChange={handleChange}
                    className={`input-mech w-full p-4 font-body-lg text-on-surface ${fieldErrors.nombre_usuario ? 'border-red-500' : ''}`}
                    required
                  />
                  {fieldErrors.nombre_usuario && (
                    <span className="text-red-400 text-xs">{fieldErrors.nombre_usuario}</span>
                  )}
                </div>

                {/* Teléfono */}
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                    Teléfono de Contacto
                  </label>
                  <input
                    name="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={handleChange}
                    className={`input-mech w-full p-4 font-body-lg text-on-surface ${fieldErrors.telefono ? 'border-red-500' : ''}`}
                    required
                  />
                  {fieldErrors.telefono && (
                    <span className="text-red-400 text-xs">{fieldErrors.telefono}</span>
                  )}
                </div>

                {/* Dirección */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                    Dirección de Envío / Local
                  </label>
                  <input
                    name="direccion"
                    type="text"
                    value={formData.direccion}
                    onChange={handleChange}
                    className={`input-mech w-full p-4 font-body-lg text-on-surface ${fieldErrors.direccion ? 'border-red-500' : ''}`}
                    required
                  />
                  {fieldErrors.direccion && (
                    <span className="text-red-400 text-xs">{fieldErrors.direccion}</span>
                  )}
                </div>

              </div>
            </div>

            {/* Card: Seguridad */}
            <div className="modular-card p-8 flex flex-col gap-8">
              <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
                <span className="material-symbols-outlined text-primary-container">security</span>
                <h3 className="font-label-md text-label-md text-primary-container uppercase tracking-widest font-bold">
                  Seguridad
                </h3>
              </div>
              <div className="flex flex-col gap-6">
                
                {/* Contraseña Actual */}
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                    Contraseña Actual
                  </label>
                  <div className="relative">
                    <input
                      ref={contrasenaActualInputRef}
                      name="contrasena_actual"
                      type={mostrarContrasenaActual ? 'text' : 'password'}
                      placeholder="Escribe tu contraseña actual"
                      value={formData.contrasena_actual}
                      onChange={handleChange}
                      autoComplete="current-password"
                      className={`input-mech w-full p-4 pr-12 font-body-lg text-on-surface placeholder:text-surface-variant/50 placeholder:text-sm ${fieldErrors.contrasena_actual ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={toggleMostrarContrasenaActual}
                      aria-label={mostrarContrasenaActual ? 'Ocultar contraseña actual' : 'Mostrar contraseña actual'}
                      aria-pressed={mostrarContrasenaActual}
                      title={mostrarContrasenaActual ? 'Ocultar contraseña actual' : 'Mostrar contraseña actual'}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-container hover:text-yellow-300 transition-colors focus:outline-none cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xl">
                        {mostrarContrasenaActual ? 'visibility' : 'visibility_off'}
                      </span>
                    </button>
                  </div>
                  {fieldErrors.contrasena_actual && (
                    <span className="text-red-400 text-xs">{fieldErrors.contrasena_actual}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nueva Contraseña */}
                  <div className="flex flex-col gap-2">
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                      Nueva Contraseña
                    </label>
                    <div className="relative">
                      <input
                        name="contrasena"
                        type={mostrarContrasenaNueva ? 'text' : 'password'}
                        placeholder="Mínimo 8 caracteres"
                        value={formData.contrasena}
                        onChange={handleChange}
                        className={`input-mech w-full p-4 pr-12 font-body-lg text-on-surface placeholder:text-surface-variant/50 placeholder:text-sm ${fieldErrors.contrasena ? 'border-red-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarContrasenaNueva(!mostrarContrasenaNueva)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-container hover:text-yellow-300 transition-colors focus:outline-none cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xl">
                          {mostrarContrasenaNueva ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                    {fieldErrors.contrasena && (
                      <span className="text-red-400 text-xs">{fieldErrors.contrasena}</span>
                    )}
                  </div>

                  {/* Confirmar Nueva Contraseña */}
                  <div className="flex flex-col gap-2">
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                      Confirmar Nueva Contraseña
                    </label>
                    <div className="relative">
                      <input
                        name="contrasena_confirmacion"
                        type={mostrarContrasenaConfirmacion ? 'text' : 'password'}
                        value={formData.contrasena_confirmacion}
                        onChange={handleChange}
                        className={`input-mech w-full p-4 pr-12 font-body-lg text-on-surface ${fieldErrors.contrasena_confirmacion ? 'border-red-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarContrasenaConfirmacion(!mostrarContrasenaConfirmacion)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-container hover:text-yellow-300 transition-colors focus:outline-none cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xl">
                          {mostrarContrasenaConfirmacion ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                    {fieldErrors.contrasena_confirmacion && (
                      <span className="text-red-400 text-xs">{fieldErrors.contrasena_confirmacion}</span>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Columna Derecha: Datos de Acceso y Estado */}
          <div className="flex flex-col gap-6">
            
            {/* Card: Datos de Acceso */}
            <div className="modular-card p-8 flex flex-col gap-8">
              <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
                <span className="material-symbols-outlined text-primary-container">login</span>
                <h3 className="font-label-md text-label-md text-primary-container uppercase tracking-widest font-bold">
                  Datos de Acceso
                </h3>
              </div>
              <div className="flex flex-col gap-8">
                
                {/* Correo Electrónico */}
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                    Correo Electrónico
                  </label>
                  <input
                    name="correo"
                    type="email"
                    value={formData.correo}
                    onChange={handleChange}
                    className={`input-mech w-full p-4 font-body-lg text-on-surface ${fieldErrors.correo ? 'border-red-500' : ''}`}
                    required
                  />
                  {fieldErrors.correo && (
                    <span className="text-red-400 text-xs">{fieldErrors.correo}</span>
                  )}
                </div>

                {/* Rol del Sistema */}
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                    Rol del Sistema
                  </label>
                  <div className="relative">
                    <select
                      name="id_rol"
                      value={formData.id_rol}
                      onChange={handleChange}
                      disabled={Number(usuarioSesion?.rol) !== 2}
                      className="input-mech w-full p-4 font-body-lg text-on-surface appearance-none pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option className="bg-black" value="1">Vendedor</option>
                      <option className="bg-black" value="2">Administrador</option>
                      <option className="bg-black" value="3">Mecanico</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                  {fieldErrors.id_rol && (
                    <span className="text-red-400 text-xs">{fieldErrors.id_rol}</span>
                  )}
                  <p className="text-xs text-outline italic mt-1 px-1">
                    Solo administradores pueden cambiar roles.
                  </p>
                </div>

              </div>
            </div>

            {/* Card decorativa: Estado de Cuenta */}
            <div className="modular-card p-6 bg-surface-container-lowest/50 border-dashed">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface uppercase">
                    Estado de Cuenta
                  </p>
                  <p className="text-primary-container font-bold">ACTIVA</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-outline-variant/20 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant">Último acceso:</span>
                  <span className="text-on-surface">{ultimoAccesoText}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant">IP registrada:</span>
                  <span className="text-on-surface">192.168.1.45</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}

export default EditarUsuario;
