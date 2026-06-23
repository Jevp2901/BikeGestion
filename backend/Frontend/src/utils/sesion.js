export const API_BASE_URL = 'http://127.0.0.1:8000/bikegestion/api';

export function guardarSesion(usuario) {
  localStorage.setItem('usuario', JSON.stringify(usuario));
  localStorage.setItem('sesion_activa', 'true');
}

export function obtenerSesion() {
  try {
    const usuarioGuardado = localStorage.getItem('usuario');
    const sesionActiva = localStorage.getItem('sesion_activa');
    if (!usuarioGuardado || sesionActiva !== 'true') {
      return null;
    }
    return JSON.parse(usuarioGuardado);
  } catch {
    localStorage.removeItem('usuario');
    localStorage.removeItem('sesion_activa');
    return null;
  }
}
