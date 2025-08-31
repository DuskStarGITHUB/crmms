/**
 * =====================================================
 *  NAME    : AdminDashboard.tsx
 *  DESCRIPTION: Dashboard de LOAD
 * =====================================================
 */

// DEPENDENCIES & COMPONENTS
import type { AuthData } from "./utils/token";
interface AdminDashboardProps {
  section: "dashboard" | "tickets" | "credentials" | string;
  data: AuthData;
}

// DASHBOARD
export default function AdminDashboard({ section, data }: AdminDashboardProps) {
  switch (section) {
    case "dashboard":
      return <div>📊 Dashboard Principal (Admin/Mod)</div>;
    case "tickets":
      return <div>📩 Panel de Tickets (Admin/Mod)</div>;
    case "credentials":
      return <div>🔑 Gestión de Credenciales (Admin/Mod)</div>;
    default:
      return <div>❓ Sección desconocida: {section}</div>;
  }
}
