/**
 * =====================================================
 *  NAME    : RenderDashboard.tsx
 *  DESCRIPTION: Dashboard render rol
 * =====================================================
 */

// DEPENDENCIES
import type { AuthData } from "./utils/token";
import AdminDashboard from "./admin/Dashboard";

// LOGIC
interface RenderDashboardProps {
  data: AuthData;
}

// RENDER
export default function RenderDashboard({ data }: RenderDashboardProps) {
  const role = data.account.role;
  switch (role) {
    case "admin":
      return <AdminDashboard data={data} />;
    case "mod":
      return (
        <div>🛡 Dashboard Mod: gestión de tickets y usuarios limitados</div>
      );
    case "access_owner":
      return (
        <div>
          🏢 Dashboard Access Owner: gestión de Guilds, Spots y Builders
        </div>
      );
    case "spot":
      return <div>👷 Dashboard Spot: control de Builders</div>;
    case "user":
      return <div>📄 Dashboard User: visualización de reportes públicos</div>;
    default:
      return <div>❓ Rol desconocido: {role}</div>;
  }
}
