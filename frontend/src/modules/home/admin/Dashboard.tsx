/**
 * =====================================================
 *  NAME    : Dashboard.tsx
 *  DESCRIPTION: Dashboard de Administradores
 * =====================================================
 */

// DEPENDENCIES
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Building2, ClipboardList } from "lucide-react";
import type { AuthData } from "../utils/token";

// LOGIC
interface AdminDashboardProps {
  data: AuthData;
}

export default function AdminDashboard({ data }: AdminDashboardProps) {
  const { first_name, last_name, phone, address } = data.user;
  const { email, role } = data.account;
  const handleCreateMod = () => alert("Función para crear un nuevo Moderador");
  const handleManageOwners = () =>
    alert("Función para ver y administrar Access Owners");
  const handleViewReports = () =>
    alert("Función para supervisar reportes generales del sistema");
  const handleViewSystemLogs = () =>
    alert("Función para revisar logs de actividad del sistema");
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Perfil del Admin */}
      <Card className="w-full border-none bg-background px-4 py-2 flex items-end justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm">{role}</span>
          </div>
          {/* Línea vertical */}
          <div className="border-l border-border h-6" />
          {/* Información del usuario */}
          <div className="text-xs text-muted-foreground flex flex-col">
            <span>
              {first_name} {last_name}
            </span>
            <span>{email}</span>
            {phone && <span>📞 {phone}</span>}
            {address && <span>🏠 {address}</span>}
          </div>
        </div>
      </Card>
      {/* Panel de acciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" /> Crear Moderador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Permite agregar un nuevo Moderador al sistema.</p>
            <Button className="mt-4 w-full" onClick={handleCreateMod}>
              Crear
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" /> Administrar Access Owners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Supervisa y gestiona todas las cuentas de Access Owners y sus
              subcuentas.
            </p>
            <Button className="mt-4 w-full" onClick={handleManageOwners}>
              Gestionar
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5" /> Supervisar Reportes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Revisión completa de reportes del sistema y actividad de usuarios.
            </p>
            <Button className="mt-4 w-full" onClick={handleViewReports}>
              Revisar
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" /> Revisar Logs del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Ver el historial de acciones realizadas en el sistema por todos
              los usuarios.
            </p>
            <Button className="mt-4 w-full" onClick={handleViewSystemLogs}>
              Ver Logs
            </Button>
          </CardContent>
        </Card>
      </div>
      {/* Espacios para métricas o gráficas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Métrica 1</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
              Gráfica placeholder
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Métrica 2</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
              Gráfica placeholder
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Métrica 3</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
              Gráfica placeholder
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
