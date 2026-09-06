import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import Home from './componentes/Home';
import About from './componentes/About';
import Registro from './componentes/Registro';
import InicioSesion from './componentes/InicioSesion';
import Inventario from './componentes/Inventario';
import Dashboard from './componentes/Dashboard';
import Ventas from './componentes/Ventas';
import PanelLayout from './componentes/PanelLayout';
import EditarUsuario from './componentes/EditarUsuario';
import OperacionPanel from './componentes/OperacionPanel';
import ComprasFlujo from './componentes/ComprasFlujo';
import UsuariosPanel from './componentes/UsuariosPanel';
import Empleados from './componentes/Empleados';
import Reportes from './componentes/Reportes';
import ProveedoresFlujo from './componentes/ProveedoresFlujo';
import { useAuth } from './utils/useAuth';
import './App.css'

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <p className="text-sm uppercase tracking-[0.35em] text-[#d0c6ab]">Cargando sesión...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/inicio_sesion" replace />;
  }

  return <Outlet />;
}

function RoleRoute({ roles }) {
  const { user, loading } = useAuth();
  if (loading) return <ProtectedRoute />;
  if (!roles.includes(Number(user?.rol))) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/inicio_sesion" element={<InicioSesion />} />
        {/*Rutas despues de inicio de sesion*/}
        <Route element={<ProtectedRoute />}>
          <Route element={<PanelLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/editarusuario" element={<EditarUsuario />} />
            <Route element={<RoleRoute roles={[1]} />}>
              <Route path="/inventario" element={<Inventario />} />
              <Route path="/cotizacion" element={<OperacionPanel tipo="cotizaciones" />} />
              <Route path="/venta" element={<Ventas />} />
              <Route path="/ventas" element={<Ventas />} />
              <Route path="/compras" element={<ComprasFlujo />} />
              <Route path="/proveedores" element={<ProveedoresFlujo />} />
            </Route>
            <Route element={<RoleRoute roles={[2]} />}>
              <Route path="/empleados" element={<Empleados />} />
              <Route path="/reportes" element={<Reportes />} />
              <Route path="/usuarios" element={<UsuariosPanel />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App;
