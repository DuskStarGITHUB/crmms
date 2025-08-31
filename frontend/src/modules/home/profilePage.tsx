/**
 * =====================================================
 *  NAME    : profilePage.tsx
 *  DESCRIPTION: Perfil del usuario
 * =====================================================
 */

// DEPENDENCIES
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchAuthData } from "./utils/token";
import type { AuthData } from "./utils/token";
import { UserCircle2, Mail, Phone, MapPin, ShieldCheck } from "lucide-react";

// PAGE
export default function ProfilePage() {
  const [data, setData] = useState<AuthData | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetchAuthData(token).then((res) => setData(res));
  }, []);
  if (!data) return <p className="text-center mt-6">Cargando perfil...</p>;
  return (
    <section className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex flex-col items-center space-y-4">
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
          <UserCircle2 className="w-24 h-24 text-gray-400" />
        </div>
        <h1 className="text-4xl font-bold">
          {data.user.first_name} {data.user.last_name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Perfil de usuario y ajustes de cuenta
        </p>
      </header>
      {/* Información básica */}
      <Card>
        <CardHeader>
          <CardTitle>Información personal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3">
            <UserCircle2 className="w-5 h-5" />
            <span>
              {data.user.first_name} {data.user.last_name}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5" />
            <span>{data.account.email}</span>
          </div>
          {data.user.phone && (
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5" />
              <span>{data.user.phone}</span>
            </div>
          )}
          {data.user.address && (
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5" />
              <span>{data.user.address}</span>
            </div>
          )}
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-5 h-5" />
            <span>{data.account.role}</span>
          </div>
        </CardContent>
      </Card>
      {/* Opciones de cuenta */}
      <Card>
        <CardHeader>
          <CardTitle>Cuenta</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-3">
          <Button variant="outline" className="w-full">
            Cambiar contraseña
          </Button>
          <Button variant="outline" className="w-full">
            Cerrar sesión
          </Button>
          <Button variant="destructive" className="w-full">
            Eliminar cuenta
          </Button>
        </CardContent>
      </Card>
      {/* Placeholder para otras configuraciones */}
      <Card>
        <CardHeader>
          <CardTitle>Configuraciones adicionales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Aquí podrías agregar otras opciones de configuración, preferencias,
            historial de actividad, etc.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Editar perfil
            </Button>
            <Button variant="outline" size="sm">
              Notificaciones
            </Button>
            <Button variant="outline" size="sm">
              Preferencias
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
