/**
 * =====================================================
 *  NAME    : authPage.tsx
 *  DESCRIPTION: authentication page (login + register)
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
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex w-1/2 bg-gray-900 items-center justify-center">
        <span className="text-white text-lg font-semibold">
          [ Imagen aquí ]
        </span>
      </div>
      <div className="flex w-full md:w-1/2 items-center justify-center px-6 py-10 bg-background">
        <div className="flex flex-col items-center w-full max-w-md space-y-6">
          <h2 className="text-2xl font-bold text-center">
            {isRegister ? "Crear Cuenta || CRM" : "Login || CRM"}
          </h2>
          <div className="w-full flex justify-center">
            {isRegister ? (
              <RegisterForm
                setErrMsg={setErrMsg}
                onSuccess={() => setIsRegister(false)}
              />
            ) : (
              <LoginForm setErrMsg={setErrMsg} onSuccess={onLoginSuccess} />
            )}
          </div>
          {errMsg && (
            <div className="text-red-600 text-sm text-center">{errMsg}</div>
          )}
          <button
            className="text-sm text-blue-600 hover:underline cursor-pointer"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister
              ? "¿Ya tienes cuenta? Inicia sesión"
              : "¿No tienes cuenta? Regístrate"}
          </button>
        </div>
      </div>
    </div>
  );
}
