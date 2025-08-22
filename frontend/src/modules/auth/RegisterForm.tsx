/**
 * =====================================================
 *  NAME    : registerForm.tsx
 *  DESCRIPTION: form register
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
import {
  Loader2,
  Mail,
  Lock,
  User,
  Home,
  Phone,
  ALargeSmall,
} from "lucide-react";

// LOGIC
type Props = {
  onSuccess?: () => void;
  setErrMsg: (msg: string | null) => void;
};

// COMPONENT
export default function RegisterForm({ onSuccess, setErrMsg }: Props) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });
  const [busy, setBusy] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg(null);
    setBusy(true);
    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: {
            first_name: form.first_name.trim(),
            last_name: form.last_name.trim(),
            address: form.address.trim(),
            phone: form.phone.trim(),
          },
          account: {
            email: form.email.trim(),
            password: form.password,
          },
        }),
        mode: "cors",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Error en registro");
      setBusy(false);
      onSuccess?.();
    } catch (err: any) {
      setErrMsg(err?.message || "Error desconocido");
      setBusy(false);
    }
  };
  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">
          Registro
        </CardTitle>
        <CardDescription className="text-center">
          Crea tu cuenta para continuar
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border rounded-md px-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Nombre"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              required
              className="border-0 focus-visible:ring-0"
            />
          </div>
          <div className="flex items-center gap-2 border rounded-md px-2">
            <ALargeSmall className="w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Apellido"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              required
              className="border-0 focus-visible:ring-0"
            />
          </div>
          <div className="flex items-center gap-2 border rounded-md px-2">
            <Home className="w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Dirección"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="border-0 focus-visible:ring-0"
            />
          </div>
          <div className="flex items-center gap-2 border rounded-md px-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <Input
              type="tel"
              placeholder="Teléfono"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="border-0 focus-visible:ring-0"
            />
          </div>
          <div className="flex items-center gap-2 border rounded-md px-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="border-0 focus-visible:ring-0"
            />
          </div>
          <div className="flex items-center gap-2 border rounded-md px-2">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="border-0 focus-visible:ring-0"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center mt-4">
          <Button type="submit" className="w-20 cursor-pointer" disabled={busy}>
            {busy ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
            {busy ? "Procesando..." : "Registrar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
