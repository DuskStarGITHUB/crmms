/**
 * =====================================================
 *  NAME    : SpotDashboard.tsx
 *  DESCRIPTION: Dashboard de Spots (áreas específicas)
 * =====================================================
 */
export default function SpotDashboard({ section, data }) {
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
