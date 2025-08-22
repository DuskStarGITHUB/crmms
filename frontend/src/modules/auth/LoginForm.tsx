/**
 * =====================================================
 *  NAME    : loginForm.tsx
 *  DESCRIPTION: login form
 * =====================================================
 */

// DEPENDENCIES
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Loader2, Mail, Lock } from "lucide-react";

// LOGIC
type Props = {
  onSuccess?: () => void;
  setErrMsg: (msg: string | null) => void;
};

// COMPONENT
export default function LoginForm({ onSuccess, setErrMsg }: Props) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg(null);
    setBusy(true);
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
        mode: "cors",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Error en login");
      if (!data?.access_token) throw new Error("El servidor no devolvió token");
      localStorage.setItem("token", data.access_token);
      setBusy(false);
      onSuccess?.();
    } catch (err: any) {
      setErrMsg(err?.message || "Error desconocido");
      setBusy(false);
    }
  };
  return (
    <Card className="w-full max-w-sm shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Iniciar sesión
        </CardTitle>
        <CardDescription className="text-center text-sm text-muted-foreground">
          Ingresa tus credenciales para continuar
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} className="space-y-6">
        <CardContent className="flex flex-col gap-5">
          <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-background">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="border-0 focus-visible:ring-0 placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-background">
            <Lock className="w-5 h-5 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="border-0 focus-visible:ring-0 placeholder:text-gray-400"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={busy}
          >
            {busy && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
            {busy ? "Procesando..." : "Entrar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
