/**
 * =====================================================
 *  NAME    : homePage.tsx
 *  DESCRIPTION: home page (role-based)
 * =====================================================
 */

import { useEffect, useState } from "react";
import { fetchAuthData } from "./utils/token";
import type { AuthData } from "./utils/token";
import AdminDashboard from "./AdminDashboard";

export default function HomePage() {
  const [data, setData] = useState<AuthData | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetchAuthData(token).then((res) => setData(res));
  }, []);
  if (!data) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <p className="text-gray-500">Cargando usuario...</p>
      </div>
    );
  }
  const { account, user } = data;
  switch (account.role) {
    case "admin":
      return (
        <AdminDashboard
          name={`${user.first_name} ${user.last_name}`}
          email={account.email}
        />
      );
    case "mod":
      return <div>Dashboard de Moderador</div>;
    case "access_owner":
      return <div>Dashboard de Access Owner</div>;
    case "guild":
      return <div>Dashboard de Guild</div>;
    case "spot":
      return <div>Dashboard de Spot</div>;
    case "builder":
      return <div>Dashboard de Builder</div>;
    case "user":
      return <div>Dashboard de Usuario</div>;
    default:
      return <div>Rol desconocido</div>;
  }
}
