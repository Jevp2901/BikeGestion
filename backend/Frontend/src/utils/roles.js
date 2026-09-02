export const ROLE_NAMES = {
  1: "Vendedor",
  2: "Administrador",
  3: "Mecanico",
};

export const ROLE_ALLOWED_MODULES = {
  1: new Set(["inventario", "venta", "ventas", "cotizacion", "compras", "proveedores"]),
  2: new Set(["empleados", "reportes"]),
};

export const COMMON_MODULES = new Set(["dashboard", "editarusuario"]);

export function getRoleName(roleId) {
  return ROLE_NAMES[Number(roleId)] || "Usuario";
}

export function canAccessModule(roleId, moduleName) {
  const normalizedRole = Number(roleId);
  return COMMON_MODULES.has(moduleName) || ROLE_ALLOWED_MODULES[normalizedRole]?.has(moduleName) || false;
}

