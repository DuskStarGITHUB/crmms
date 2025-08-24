/**
 * =====================================================
 *  NAME    : OwnerDashboard.tsx
 *  DESCRIPTION: Dashboard de Access Owners
 * =====================================================
 */

// DEPENDENCIES
import type { AuthData } from "./utils/token";
interface AdminDashboardProps {
  section: "dashboard" | "tickets" | "credentials" | string;
  data: AuthData;
}

// DASHBOARD
export default function OwnerDashboard({ section, data }: AdminDashboardProps) {
  switch (section) {
    case "tickets":
      return <div>📩 Tickets asociados a tu organización</div>;
    case "guilds":
      return <div>🏰 Gestión de Guilds (Owner)</div>;
    case "spots":
      return <div>📍 Administración de Spots</div>;
    case "builders":
      return <div>👷‍♂️ Gestión de Builders</div>;
    case "dashboard":
      return <div>📊 Dashboard Principal (Owner)</div>;
    default:
      return <div>❓ Sección desconocida: {section}</div>;
  }
}
