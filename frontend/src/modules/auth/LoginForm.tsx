/**
 * =====================================================
 *  NAME    : loginForm.tsx
 *  DESCRIPTION: form login
 * =====================================================
 */

// DEPENDENCIES
import { useState } from "react";

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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 w-full max-w-xs"
    >
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="border px-2 py-1 rounded"
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="border px-2 py-1 rounded"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-60"
        disabled={busy}
      >
        {busy ? "Procesando..." : "Entrar"}
      </button>
    </form>
  );
}
