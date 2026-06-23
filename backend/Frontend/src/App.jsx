import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Outlet, useNavigate } from "react-router-dom";
import Home from './componentes/Home';
import About from './componentes/About';
import Registro from './componentes/Registro';
import InicioSesion from './componentes/InicioSesion';
import Inventario from './componentes/Inventario';
import Empleados from './componentes/Empleados';
import Reportes from "./componentes/Reportes";
import Dashboard from './componentes/Dashboard';
import Venta from './componentes/Ventas';
import Compras from './componentes/Compras';
import PanelLayout from './componentes/PanelLayout';
import EditarUsuario from './componentes/EditarUsuario';
import { obtenerSesion } from './utils/sesion';
import './App.css'

function ProtectedRoute() {
  const navigate = useNavigate();
  const [listo, setListo] = useState(false);
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    const usuario = obtenerSesion();
    if (usuario) {
      setAutenticado(true);
    } else {
      navigate('/inicio_sesion', { replace: true });
    }
    setListo(true);
  }, [navigate]);

  if (!listo) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">Cargando...</p>
      </div>
    );
  }

  return autenticado ? <Outlet /> : null;
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
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/venta" element={<Venta />} />
            <Route path="/compras" element={<Compras />} />
            <Route path="/empleados" element={<Empleados />} />
            <Route path="/reportes" element={<Reportes />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App;
