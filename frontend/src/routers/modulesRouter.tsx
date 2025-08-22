/**
 * =====================================================
 *  NAME    : modulesRouter.tsx
 *  DESCRIPTION: joiner modules routes
 * =====================================================
 */

// ROUTES
import AuthRouter from "@/modules/auth/authRouter";
import HomeRouter from "@/modules/home/homeRouter";

// MODULES
export default function ModulesRouter() {
  return (
    <AuthRouter>
      <HomeRouter />
    </AuthRouter>
  );
}
