// routers/modulesRouter.tsx
/**
 * =====================================================
 *  NAME    : modulesRouter.tsx
 *  DESCRIPTION: example directory
 * =====================================================
 */

// ROUTERS
import AuthRouter from "@/modules/auth/authRouter";

// DEFAULT
export default function ModulesRouter() {
  return (
    <>
      <AuthRouter />
    </>
  );
}
