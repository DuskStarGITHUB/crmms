"use client";

import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { fetchAuthData } from "./utils/token";
import type { AuthData } from "./utils/token";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Home,
  Settings,
  LogOut,
  User,
  Ticket,
  Users,
  Building2,
  ClipboardList,
  Menu,
  Box,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import AdminDashboard from "./AdminDashboard";
import OwnerDashboard from "./OwnerDashboard";
import SpotDashboard from "./SpotDashboard";
import UserDashboard from "./UserDashboard";

export default function HomePage() {
  const [data, setData] = useState<AuthData | null>(null);
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetchAuthData(token).then((res) => setData(res));
  }, []);

  if (!data) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 border-4 border-muted-foreground/30 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground animate-pulse text-lg font-medium">
            Cargando CRM...
          </p>
        </div>
      </div>
    );
  }

  const role = data.account.role;

  const logout = () => {
    localStorage.removeItem("token");
    setActive("logout");
  };

  const sidebarOptions: Record<
    string,
    { label: string; icon: any; action: () => void }[]
  > = {
    admin: [
      { label: "Dashboard", icon: Home, action: () => setActive("dashboard") },
      { label: "Tickets", icon: Ticket, action: () => setActive("tickets") },
      {
        label: "Credenciales",
        icon: Users,
        action: () => setActive("credentials"),
      },
      { label: "Perfil", icon: User, action: () => setActive("profile") },
      {
        label: "Configuración",
        icon: Settings,
        action: () => setActive("configuration"),
      },
    ],
    access_owner: [
      { label: "Dashboard", icon: Home, action: () => setActive("dashboard") },
      { label: "Tickets", icon: Ticket, action: () => setActive("tickets") },
      { label: "Guilds", icon: Building2, action: () => setActive("guilds") },
      { label: "Spots", icon: ClipboardList, action: () => setActive("spots") },
      { label: "Builders", icon: Users, action: () => setActive("builders") },
      { label: "Perfil", icon: User, action: () => setActive("profile") },
      {
        label: "Configuración",
        icon: Settings,
        action: () => setActive("configuration"),
      },
    ],
    spot: [
      { label: "Dashboard", icon: Home, action: () => setActive("dashboard") },
      { label: "Tickets", icon: Ticket, action: () => setActive("tickets") },
      { label: "Builders", icon: Users, action: () => setActive("builders") },
      {
        label: "Perfil (Área)",
        icon: User,
        action: () => setActive("profile"),
      },
      {
        label: "Configuración",
        icon: Settings,
        action: () => setActive("configuration"),
      },
    ],
    user: [
      { label: "Dashboard", icon: Home, action: () => setActive("dashboard") },
      { label: "Tickets", icon: Ticket, action: () => setActive("tickets") },
      {
        label: "Informes Públicos",
        icon: ClipboardList,
        action: () => setActive("reports"),
      },
      {
        label: "Guilds Públicas",
        icon: Building2,
        action: () => setActive("guilds"),
      },
      { label: "Perfil", icon: User, action: () => setActive("profile") },
      {
        label: "Configuración",
        icon: Settings,
        action: () => setActive("configuration"),
      },
    ],
    mod: [
      { label: "Dashboard", icon: Home, action: () => setActive("dashboard") },
      { label: "Tickets", icon: Ticket, action: () => setActive("tickets") },
      {
        label: "Credenciales",
        icon: Users,
        action: () => setActive("credentials"),
      },
      { label: "Perfil", icon: User, action: () => setActive("profile") },
      {
        label: "Configuración",
        icon: Settings,
        action: () => setActive("configuration"),
      },
    ],
  };

  const renderDashboard = () => {
    if (active === "logout")
      return <div className="text-center mt-20 text-xl">Sesión cerrada</div>;
    switch (role) {
      case "admin":
      case "mod":
        return <AdminDashboard section={active} data={data} />;
      case "access_owner":
        return <OwnerDashboard section={active} data={data} />;
      case "spot":
        return <SpotDashboard section={active} data={data} />;
      case "user":
        return <UserDashboard section={active} data={data} />;
      default:
        return <div>Rol desconocido</div>;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <aside
        className={`hidden md:flex md:flex-col border-r border-border bg-sidebar transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex flex-col flex-1 p-6 gap-4">
          {/* LOGO */}
          <div className="flex items-center justify-center mb-6">
            {sidebarOpen && (
              <>
                <Box className="w-8 h-8 mr-2 text-primary" />
                <span className="text-2xl font-extrabold tracking-tight text-foreground">
                  CRMMS
                </span>
              </>
            )}
          </div>

          {/* MENÚ */}
          <nav className="flex-1 flex flex-col gap-2">
            {sidebarOptions[role]?.map((opt, idx) => (
              <Button
                key={idx}
                variant="ghost"
                className={`flex items-center gap-3 justify-start rounded-lg ${
                  !sidebarOpen ? "justify-center" : ""
                }`}
                onClick={opt.action}
              >
                <opt.icon className="w-5 h-5" />
                {sidebarOpen && opt.label}
              </Button>
            ))}
          </nav>

          {/* BOTONES INFERIORES */}
          <div className="mt-auto flex flex-col items-center gap-2">
            {/* Toggle Sidebar */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <ChevronsLeft className="w-5 h-5" />
              ) : (
                <ChevronsRight className="w-5 h-5" />
              )}
            </Button>

            {/* Logout */}
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full"
              onClick={logout}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 md:hidden z-50"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-6">
          <div className="flex items-center justify-center mb-6">
            <Box className="w-8 h-8 mr-2 text-primary" />
            <span className="text-2xl font-extrabold tracking-tight text-foreground">
              CRMMS
            </span>
          </div>
          <nav className="flex flex-col gap-2">
            {sidebarOptions[role]?.map((opt, idx) => (
              <Button
                key={idx}
                variant="ghost"
                className="flex items-center gap-3 justify-start rounded-lg"
                onClick={() => {
                  opt.action();
                  setMobileOpen(false);
                }}
              >
                <opt.icon className="w-5 h-5" />
                {opt.label}
              </Button>
            ))}
          </nav>
          <Button
            variant="secondary"
            size="icon"
            className="mt-6 rounded-full flex items-center justify-center"
            onClick={() => {
              logout();
              setMobileOpen(false);
            }}
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </SheetContent>
      </Sheet>
      <main className="flex-1 overflow-auto p-6">
        {renderDashboard()}
        <Outlet />
      </main>
    </div>
  );
}
