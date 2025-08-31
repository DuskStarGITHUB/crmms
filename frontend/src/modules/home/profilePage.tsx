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
    <section className="p-6 text-center">
      <header>
        <h1 className="text-5xl">Perfil de Cuenta</h1>
      </header>
      <article className="mt-8 max-w-4xl mx-auto">
        <table className="w-full border-collapse text-left text-lg sm:text-xl">
          <tbody>
            <tr className="border-b border-gray-300">
              <th className="py-3 pr-6 font-medium">Nombre completo</th>
              <td className="py-3">
                {data.user.first_name} {data.user.last_name}
              </td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="py-3 pr-6 font-medium">Correo electrónico</th>
              <td className="py-3">{data.account.email}</td>
            </tr>
            {data.user.phone && (
              <tr className="border-b border-gray-300">
                <th className="py-3 pr-6 font-medium">Teléfono</th>
                <td className="py-3">{data.user.phone}</td>
              </tr>
            )}
            {data.user.address && (
              <tr className="border-b border-gray-300">
                <th className="py-3 pr-6 font-medium">Dirección</th>
                <td className="py-3">{data.user.address}</td>
              </tr>
            )}
            <tr className="border-b border-gray-300">
              <th className="py-3 pr-6 font-medium">Rol</th>
              <td className="py-3">{data.account.role}</td>
            </tr>
          </tbody>
        </table>
      </article>
    </section>
  );
}
