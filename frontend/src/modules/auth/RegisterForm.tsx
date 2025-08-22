/**
 * =====================================================
 *  NAME    : registerForm.tsx
 *  DESCRIPTION: form register
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
export default function RegisterForm({ onSuccess, setErrMsg }: Props) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
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
          },
          account: { email: form.email.trim(), password: form.password },
        }),
        mode: "cors",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Error en registro");
      alert("Registro exitoso, ahora puedes iniciar sesión");
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
        type="text"
        placeholder="Nombre"
        value={form.first_name}
        onChange={(e) => setForm({ ...form, first_name: e.target.value })}
        className="border px-2 py-1 rounded"
        required
      />
      <input
        type="text"
        placeholder="Apellido"
        value={form.last_name}
        onChange={(e) => setForm({ ...form, last_name: e.target.value })}
        className="border px-2 py-1 rounded"
        required
      />
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
        className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-60"
        disabled={busy}
      >
        {busy ? "Procesando..." : "Registrar"}
      </button>
    </form>
  );
}
