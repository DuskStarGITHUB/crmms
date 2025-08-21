// modules/home/authRouter.tsx
/**
 * =====================================================
 *  NAME    : authRouter.tsx
 *  DESCRIPTION: module auth init
 * =====================================================
 */

// JOINERS
import { ThemeProvider, ThemeToggle } from "./ThemeToggle";

// MODULE
export default function AuthRouter() {
  return (
    <>
      <ThemeProvider defaultTheme="dark">
        <div
          style={{
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
            transition: "background-color 0.3s, color 0.3s",
          }}
        >
          <ThemeToggle />
          {/* NEW ROUTERS */}
        </div>
      </ThemeProvider>
    </>
  );
}
