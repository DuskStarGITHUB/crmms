/**
 * =====================================================
 *  NAME    : authPage.tsx
 *  DESCRIPTION: authentication page
 * =====================================================
 */

// DEPENDENCIES && COMPONENTS
import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

// LOGIC
type Props = { onLoginSuccess?: () => void };

// PAGE
export default function AuthPage({ onLoginSuccess }: Props) {
  const [isRegister, setIsRegister] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-xl font-bold mb-4">
        {isRegister ? "Registro" : "Login"}
      </h2>
      {isRegister ? (
        <RegisterForm
          setErrMsg={setErrMsg}
          onSuccess={() => setIsRegister(false)}
        />
      ) : (
        <LoginForm setErrMsg={setErrMsg} onSuccess={onLoginSuccess} />
      )}
      {errMsg && <div className="text-red-600 text-sm mt-2">{errMsg}</div>}
      <button
        className="mt-3 text-blue-700 underline"
        onClick={() => setIsRegister(!isRegister)}
      >
        {isRegister
          ? "¿Ya tienes cuenta? Inicia sesión"
          : "¿No tienes cuenta? Regístrate"}
      </button>
    </div>
  );
}
