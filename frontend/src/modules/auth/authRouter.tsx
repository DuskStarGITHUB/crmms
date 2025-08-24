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
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          <span className="mt-4 animate-pulse text-gray-600 text-lg font-medium">
            Verificando sesión…
          </span>
        </div>
      </div>
    );
  }
  if (!valid) {
    return <AuthPage onLoginSuccess={() => window.location.reload()} />;
  }
  return <>{children}</>;
}
