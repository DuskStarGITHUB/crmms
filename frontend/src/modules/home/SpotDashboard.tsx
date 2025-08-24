/**
 * =====================================================
 *  NAME    : SpotDashboard.tsx
 *  DESCRIPTION: Dashboard de Spots (áreas específicas)
 * =====================================================
 */

// DEPENDENCIES
import type { AuthData } from "./utils/token";
interface AdminDashboardProps {
  section: "dashboard" | "tickets" | "credentials" | string;
  data: AuthData;
}

// DASHBOARD
export default function SpotDashboard({ section, data }: AdminDashboardProps) {
  switch (section) {
    case "tickets":
      return <div>📩 Tickets relacionados a tu Spot</div>;
    case "builders":
      return <div>👷‍♂️ Builders asignados a tu Spot</div>;
    case "dashboard":
      return <div>📊 Dashboard Principal (Spot)</div>;
    default:
      return <div>❓ Sección desconocida: {section}</div>;
  }
}
