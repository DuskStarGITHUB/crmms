/**
 * =====================================================
 *  NAME    : UserDashboard.tsx
 *  DESCRIPTION: Dashboard de Usuarios estándar
 * =====================================================
 */
export default function UserDashboard({ section, data }) {
  switch (section) {
    case "tickets":
      return <div>📩 Mis Tickets</div>;
    case "reports":
      return <div>📑 Informes Públicos</div>;
    case "guilds":
      return <div>🏰 Guilds Públicas</div>;
    case "dashboard":
      return <div>📊 Dashboard Principal (Usuario)</div>;
    default:
      return <div>❓ Sección desconocida: {section}</div>;
  }
}
