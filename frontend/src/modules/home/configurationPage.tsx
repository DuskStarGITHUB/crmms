/**
 * =====================================================
 *  NAME    : ConfigurationPage.tsx
 *  DESCRIPTION: Página de configuración con UI completa
 * =====================================================
 */

// DEPENDENCIES
import { useTheme } from "@/components/app/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// PAGE
export default function ConfigurationPage() {
  const { theme, setTheme } = useTheme();
  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Configuración</h1>
      <p className="text-sm text-muted-foreground">
        Ajusta las preferencias de tu cuenta y del sistema.
      </p>
      {/* Theme Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Tema</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span>Modo oscuro / claro</span>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={handleThemeToggle}
          />
        </CardContent>
      </Card>
      {/* Language Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Idioma</CardTitle>
        </CardHeader>
        <CardContent>
          <Select defaultValue="es">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecciona un idioma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="en">Inglés</SelectItem>
              <SelectItem value="fr">Francés</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notificaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Email</span>
            <Switch defaultChecked={true} />
          </div>
          <div className="flex items-center justify-between">
            <span>SMS</span>
            <Switch defaultChecked={false} />
          </div>
          <div className="flex items-center justify-between">
            <span>Push Notifications</span>
            <Switch defaultChecked={true} />
          </div>
        </CardContent>
      </Card>
      {/* Other Placeholder Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Avanzado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Modo desarrollador</span>
            <Switch defaultChecked={false} />
          </div>
          <Button variant="outline">Restaurar configuración por defecto</Button>
        </CardContent>
      </Card>
    </div>
  );
}
