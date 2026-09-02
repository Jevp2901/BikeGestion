import { useAuth } from "../utils/useAuth";
import ModulePlaceholder from "./ModulePlaceholder";
import OperacionPanel from "./OperacionPanel";

function UsuariosPanel() {
  const { user } = useAuth();
  if (Number(user?.rol) === 3) {
    return <OperacionPanel tipo="mantenimiento" />;
  }
  return <ModulePlaceholder eyebrow="Usuarios" title="Gestión de Usuarios" description="Administra tu cuenta y aplica las funciones permitidas por tu rol." primaryActionLabel="Editar mi perfil" secondaryActionLabel="Ver roles" icon="manage_accounts" highlights={["El Administrador gestiona cuentas de otros usuarios.", "Vendedores y Mecánicos gestionan únicamente su propia cuenta.", "Roles disponibles: Administrador, Vendedor y Mecanico."]} />;
}

export default UsuariosPanel;
