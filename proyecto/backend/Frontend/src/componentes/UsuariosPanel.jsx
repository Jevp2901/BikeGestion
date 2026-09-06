import { useEffect, useState } from "react";
import { API_V1_BASE_URL } from "../utils/sesion";

function UsuariosPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const [filterRole, setFilterRole] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showAuditModal, setShowAuditModal] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    documento: "",
    correo: "",
    direccion: "",
    rol_id: 1, // 1: Vendedor, 2: Administrador, 3: Mecanico
    contrasena: "",
  });

  const loadUsuarios = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_V1_BASE_URL}/usuarios/lista/`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo cargar la lista de usuarios de la base de datos.");
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const handleResetForm = () => {
    setForm({
      nombre: "",
      apellidos: "",
      documento: "",
      correo: "",
      direccion: "",
      rol_id: 1,
      contrasena: "",
    });
    setError("");
    setNotice("");
  };

  const handleGeneratePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm((prev) => ({ ...prev, contrasena: pass }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");

    if (!form.nombre || !form.apellidos || !form.documento || !form.correo || !form.contrasena) {
      setError("Por favor completa todos los campos obligatorios (*).");
      return;
    }

    try {
      const response = await fetch(`${API_V1_BASE_URL}/registrar/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: form.correo,
          contrasena: form.contrasena,
          id_rol: form.rol_id,
          nombre_usuario: `${form.nombre} ${form.apellidos}`.trim(),
          numero_documento: form.documento,
          direccion: form.direccion,
        }),
      });

      const text = await response.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Respuesta no válida del servidor al registrar el usuario.");
      }

      if (!response.ok) throw new Error(data.error || data.mensaje || "No fue posible registrar el usuario.");

      setNotice("Usuario y credenciales creados exitosamente con encriptación segura.");
      handleResetForm();
      loadUsuarios();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredUsuarios = usuarios.filter((u) => {
    if (filterRole === "admins") return u.rol_id === 2;
    if (filterRole === "vendedores") return u.rol_id === 1;
    if (filterRole === "mecanicos") return u.rol_id === 3;
    return true;
  });

  const getInitials = (name) => {
    if (!name) return "US";
    const parts = name.split(" ");
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
  };

  const getRoleBadge = (rolId) => {
    if (rolId === 2)
      return <span className="rounded-full border border-[#ffd700]/40 bg-[#ffd700]/10 px-3 py-1 text-[10px] font-bold text-[#ffd700]">ADMINISTRADOR</span>;
    if (rolId === 1)
      return <span className="rounded-full border border-cyan-800 bg-cyan-950/40 px-3 py-1 text-[10px] font-bold text-cyan-400">VENDEDOR</span>;
    return <span className="rounded-full border border-amber-800 bg-amber-950/40 px-3 py-1 text-[10px] font-bold text-amber-400">MECÁNICO</span>;
  };

  const getPermissionsMatrix = (rolId) => {
    const isVendedor = rolId === 1;
    const isAdmin = rolId === 2;
    const isMecanico = rolId === 3;

    return [
      { name: "Inventario", allowed: isVendedor },
      { name: "Cotizaciones", allowed: isVendedor },
      { name: "Ventas", allowed: isVendedor },
      { name: "Compras", allowed: isVendedor },
      { name: "Proveedores", allowed: isVendedor },
      { name: "Empleados", allowed: isAdmin },
      { name: "Usuarios", allowed: isAdmin },
      { name: "Reportes BI", allowed: isAdmin },
      { name: "Mantenimiento", allowed: isMecanico },
    ];
  };

  return (
    <section className="mx-auto max-w-7xl space-y-6 text-[#e3e2e2]">
      
      {/* Subheader superior */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#4d4732] pb-4 md:flex-row md:items-end">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#ffd700]">
            SEGURIDAD Y CONTROL DE ACCESO AL SISTEMA
          </span>
          <h1 className="mt-1 text-3xl font-black uppercase italic tracking-tight text-[#e3e2e2]">
            GESTIÓN DE USUARIOS Y ROLES
          </h1>
          <p className="mt-1 text-xs text-[#d0c6ab]">
            Administración exclusiva de credenciales y asignación estricta de los 3 roles del sistema (Administrador, Vendedor y Mecánico).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAuditModal(true)}
            className="flex items-center gap-2 rounded-xl border border-[#4d4732] bg-[#0d0e0f] px-4 py-2.5 text-xs font-bold text-[#ffd700] hover:border-[#ffd700] hover:bg-[#121212]"
          >
            <span className="material-symbols-outlined text-sm">history</span>
            Auditoría de Acceso
          </button>
        </div>
      </div>

      {/* Regla de Seguridad: Separación de Entidades */}
      <div className="flex items-start gap-3 rounded-xl border border-[#ffd700]/40 bg-[#0d0e0f] p-4 shadow-lg">
        <span className="material-symbols-outlined text-[#ffd700]">verified_user</span>
        <div className="text-xs">
          <span className="font-bold text-[#ffd700]">REGLA DE SEGURIDAD Y SEPARACIÓN DE ENTIDADES:</span>
          <p className="mt-0.5 text-[#d0c6ab]">
            Los clientes y proveedores son entidades de trazabilidad comercial y <strong>no poseen acceso ni cuentas de usuario</strong> en este software administrativo de taller.
          </p>
        </div>
      </div>

      {notice && <div className="rounded-xl border border-green-800 bg-green-950/40 p-3 text-xs text-green-300">{notice}</div>}
      {error && <div className="rounded-xl border border-red-800 bg-red-950/40 p-3 text-xs text-red-300">{error}</div>}

      {/* Grid Principal: Lista a la Izquierda, Formulario a la Derecha */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Izquierda: Usuarios Activos */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="overflow-hidden rounded-2xl border border-[#4d4732] bg-[#0a0a0a] shadow-xl">
            <div className="flex flex-col justify-between gap-3 border-b border-[#1f1f1f] bg-[#121212] p-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#e3e2e2]">
                  Usuarios Activos <span className="ml-2 rounded-full bg-[#ffd700]/10 px-2 py-0.5 text-[10px] text-[#ffd700]">{usuarios.length} Registrados</span>
                </h2>
              </div>
              <div className="flex rounded-lg border border-[#333] bg-[#080808] p-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setFilterRole("todos")}
                  className={`rounded px-3 py-1 font-bold ${filterRole === "todos" ? "bg-[#ffd700] text-black" : "text-[#d0c6ab]"}`}
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setFilterRole("admins")}
                  className={`rounded px-3 py-1 font-bold ${filterRole === "admins" ? "bg-[#ffd700] text-black" : "text-[#d0c6ab]"}`}
                >
                  Admins
                </button>
                <button
                  type="button"
                  onClick={() => setFilterRole("vendedores")}
                  className={`rounded px-3 py-1 font-bold ${filterRole === "vendedores" ? "bg-[#ffd700] text-black" : "text-[#d0c6ab]"}`}
                >
                  Vendedores
                </button>
                <button
                  type="button"
                  onClick={() => setFilterRole("mecanicos")}
                  className={`rounded px-3 py-1 font-bold ${filterRole === "mecanicos" ? "bg-[#ffd700] text-black" : "text-[#d0c6ab]"}`}
                >
                  Mecánicos
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-[#d0c6ab]">Cargando usuarios...</div>
            ) : (
              <div className="divide-y divide-[#1f1f1f]">
                {filteredUsuarios.map((u) => (
                  <div key={u.id_usuario} className="flex items-center justify-between p-4 hover:bg-[#121212] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 font-bold text-[#ffd700] text-xs">
                        {getInitials(u.nombre_usuario)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-sm">{u.nombre_usuario}</h3>
                          <span className="text-[10px] text-[#d0c6ab]">ID #{u.id_usuario}</span>
                        </div>
                        <p className="text-xs text-[#d0c6ab]">{u.correo}</p>
                        <p className="text-[10px] text-[#d0c6ab]/70">Doc: {u.numero_documento}</p>
                      </div>
                    </div>
                    <div>{getRoleBadge(u.rol_id)}</div>
                  </div>
                ))}
                {filteredUsuarios.length === 0 && (
                  <div className="p-8 text-center text-xs text-[#d0c6ab]">No se encontraron usuarios en este filtro.</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Derecha: Formulario Crear Usuario */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-[#4d4732] bg-[#0d0e0f] p-5 shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#ffd700]">Registro de Credenciales</span>
                <h2 className="text-base font-black uppercase text-white">Crear Nuevo Usuario</h2>
              </div>
              <button
                type="button"
                onClick={handleResetForm}
                className="rounded bg-[#ffd700]/10 px-2.5 py-1 text-[10px] font-bold text-[#ffd700] hover:bg-[#ffd700]/20 transition-all border border-[#ffd700]/30"
              >
                + NUEVO REGISTRO
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label>
                <span className="block font-bold text-[#d0c6ab]">Nombres *</span>
                <input
                  type="text"
                  required
                  placeholder="Ej. Camilo Andrés"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#333] bg-[#080808] p-2.5 text-white outline-none focus:border-[#ffd700]"
                />
              </label>

              <label>
                <span className="block font-bold text-[#d0c6ab]">Apellidos *</span>
                <input
                  type="text"
                  required
                  placeholder="Ej. Mendoza Soto"
                  value={form.apellidos}
                  onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#333] bg-[#080808] p-2.5 text-white outline-none focus:border-[#ffd700]"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label>
                <span className="block font-bold text-[#d0c6ab]">Documento de Identidad *</span>
                <input
                  type="text"
                  required
                  placeholder="Cédula de Ciudadanía"
                  value={form.documento}
                  onChange={(e) => setForm({ ...form, documento: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#333] bg-[#080808] p-2.5 text-white outline-none focus:border-[#ffd700]"
                />
              </label>

              <label>
                <span className="block font-bold text-[#d0c6ab]">Correo Electrónico (Login) *</span>
                <input
                  type="email"
                  required
                  placeholder="usuario@bikegestion.co"
                  value={form.correo}
                  onChange={(e) => setForm({ ...form, correo: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#333] bg-[#080808] p-2.5 text-white outline-none focus:border-[#ffd700]"
                />
              </label>
            </div>

            <label className="block">
              <span className="font-bold text-[#d0c6ab]">Dirección de Contacto</span>
              <input
                type="text"
                placeholder="Ej. Carrera 15 # 85-32, Bogotá"
                value={form.direccion}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[#333] bg-[#080808] p-2.5 text-white outline-none focus:border-[#ffd700]"
              />
            </label>

            <label className="block">
              <span className="font-bold text-[#d0c6ab]">Selección de Rol *</span>
              <select
                value={form.rol_id}
                onChange={(e) => setForm({ ...form, rol_id: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-[#333] bg-[#080808] p-2.5 text-white outline-none focus:border-[#ffd700]"
              >
                <option value={1}>Vendedor (Ventas, Cotizaciones, Compras, Proveedores)</option>
                <option value={2}>Administrador (Supervisión Total, Empleados, Reportes)</option>
                <option value={3}>Mecánico (Mantenimiento y Reparación de Bicicletas)</option>
              </select>
            </label>

            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#d0c6ab]">Contraseña Inicial *</span>
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="text-[10px] font-bold text-[#ffd700] hover:underline"
                >
                  ⚡ Generar Aleatoria
                </button>
              </div>
              <input
                type="text"
                required
                placeholder="••••••••••••"
                value={form.contrasena}
                onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
                className="mt-1 w-full font-mono rounded-lg border border-[#333] bg-[#080808] p-2.5 text-white outline-none focus:border-[#ffd700]"
              />
              <p className="mt-1 text-[10px] text-[#d0c6ab]">
                La contraseña se protegerá con encriptación segura al momento de guardar.
              </p>
            </div>

            {/* Vista Previa de Permisos Automáticos */}
            <div className="rounded-xl border border-[#1f1f1f] bg-[#080808] p-3">
              <span className="block text-[10px] font-bold uppercase text-[#ffd700]">Matriz de Permisos Automáticos</span>
              <div className="mt-2 grid grid-cols-3 gap-1 text-[10px]">
                {getPermissionsMatrix(form.rol_id).map((item) => (
                  <div key={item.name} className={`flex items-center gap-1 ${item.allowed ? "text-green-400" : "text-[#d0c6ab]/40"}`}>
                    <span className="material-symbols-outlined text-[12px]">
                      {item.allowed ? "check_circle" : "cancel"}
                    </span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[#1f1f1f] pt-3">
              <button
                type="button"
                onClick={handleResetForm}
                className="rounded-lg border border-[#333] px-4 py-2 text-xs font-bold text-[#d0c6ab] hover:border-[#ffd700]"
              >
                Limpiar
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#ffd700] px-6 py-2 text-xs font-black uppercase text-black hover:bg-[#ffe16d]"
              >
                GUARDAR USUARIO
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* Modal Auditoría de Acceso */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-[#4d4732] bg-[#0d0e0f] p-6 text-[#e3e2e2] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#ffd700]">Registro de Autenticación de Usuarios</span>
                <h2 className="text-lg font-black uppercase text-white">Auditoría de Sesiones Activas</h2>
              </div>
              <button type="button" onClick={() => setShowAuditModal(false)} className="text-xs text-[#d0c6ab] hover:text-white">✕</button>
            </div>

            <div className="mt-4 overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#1f1f1f] bg-[#080808] uppercase tracking-wider text-[#ffd700]">
                    <th className="p-3">Usuario</th>
                    <th className="p-3">Rol</th>
                    <th className="p-3">Estado Cuenta</th>
                    <th className="p-3">Tipo Sesión</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f1f1f]">
                  {usuarios.map((u) => (
                    <tr key={u.id_usuario} className="hover:bg-[#121212]">
                      <td className="p-3">
                        <p className="font-bold text-white">{u.nombre_usuario}</p>
                        <p className="text-[10px] text-[#d0c6ab]">{u.correo}</p>
                      </td>
                      <td className="p-3 font-mono">{u.rol_nombre || getRoleBadge(u.rol_id)}</td>
                      <td className="p-3">
                        <span className="rounded-full bg-green-950/60 border border-green-800 px-2 py-0.5 text-[10px] text-green-400">
                          Autenticada
                        </span>
                      </td>
                      <td className="p-3 text-[#d0c6ab]">Sesión Web Segura</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end border-t border-[#1f1f1f] pt-4">
              <button
                type="button"
                onClick={() => setShowAuditModal(false)}
                className="rounded-lg bg-[#ffd700] px-5 py-2 text-xs font-black uppercase text-black hover:bg-[#ffe16d]"
              >
                Cerrar Auditoría
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}

export default UsuariosPanel;
