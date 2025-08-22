/**
 * =====================================================
 *  NAME    : authRouter.tsx
 *  DESCRIPTION: router auth
 * =====================================================
 */

// DEPENDENCIES
import { useEffect, useMemo, useState } from "react";
import { decodeJwt, verifyTokenRemote } from "./jwt";
import AuthPage from "./authPage";

// LOGIC
type AuthRouterProps = { children: React.ReactNode };

// ROUTER
export default function AuthRouter({ children }: AuthRouterProps) {
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const token = useMemo(() => localStorage.getItem("token"), []);
  useEffect(() => {
    (async () => {
      if (!token) {
        setValid(false);
        setLoading(false);
        return;
      }
      const payload = decodeJwt<{ exp: number }>(token);
      const now = Math.floor(Date.now() / 1000);
      if (!payload?.exp || payload.exp <= now) {
        localStorage.removeItem("token");
        setValid(false);
        setLoading(false);
        return;
      }
      const ok = await verifyTokenRemote(token);
      if (!ok) {
        localStorage.removeItem("token");
      }
      setValid(ok);
      setLoading(false);
    })();
  }, [token]);
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="animate-pulse text-gray-500">Verificando sesión…</span>
      </div>
    );
  }
  if (!valid) {
    return <AuthPage onLoginSuccess={() => window.location.reload()} />;
  }
  return <>{children}</>;
}
