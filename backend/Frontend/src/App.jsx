import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import Home from './componentes/Home';
import About from './componentes/About';
import Registro from './componentes/Registro';
import InicioSesion from './componentes/InicioSesion';
import Inventario from './componentes/Inventario';
import Dashboard from './componentes/Dashboard';
import PanelLayout from './componentes/PanelLayout';
import EditarUsuario from './componentes/EditarUsuario';
import ModulePlaceholder from './componentes/ModulePlaceholder';
import OperacionPanel from './componentes/OperacionPanel';
import UsuariosPanel from './componentes/UsuariosPanel';
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
              <Route path="/venta" element={<OperacionPanel tipo="ventas" />} />
              <Route path="/ventas" element={<OperacionPanel tipo="ventas" />} />
              <Route path="/compras" element={<OperacionPanel tipo="compras" />} />
              <Route path="/proveedores" element={<OperacionPanel tipo="proveedores" />} />
            </Route>
            <Route element={<RoleRoute roles={[2]} />}>
              <Route path="/empleados" element={<OperacionPanel tipo="empleados" />} />
              <Route path="/reportes" element={<OperacionPanel tipo="reportes" />} />
            </Route>
            <Route path="/usuarios" element={<UsuariosPanel />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App;
