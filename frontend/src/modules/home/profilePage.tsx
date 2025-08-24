/**
 * =====================================================
 *  NAME    : profilePage.tsx
 *  DESCRIPTION: Perfil del usuario
 * =====================================================
 */
import { useEffect, useState } from "react";
import { fetchAuthData } from "./utils/token";
import type { AuthData } from "./utils/token";

export default function ProfilePage() {
  const [data, setData] = useState<AuthData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetchAuthData(token).then((res) => setData(res));
  }, []);

  if (!data) return <p>Cargando perfil...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Perfil</h1>
      <p>
        <strong>Usuario:</strong> {data.user.first_name}
      </p>
      <p>
        <strong>Rol:</strong> {data.account.role}
      </p>
      <p>
        <strong>Guild:</strong> {data.user.phone ?? "N/A"}
      </p>
    </div>
  );
}
