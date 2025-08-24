// AdminDashboard.tsx
type Props = {
  name: string;
  email: string;
};

export default function AdminDashboard({ name, email }: Props) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold">Panel de Administración</h2>
      <p className="text-gray-600">Bienvenido, {name}</p>
      <p className="text-sm text-gray-500">Email: {email}</p>
      <div className="mt-4 p-4 border rounded-lg shadow-md w-80 text-center">
        <p className="font-semibold">Opciones de Admin</p>
        <ul className="text-sm mt-2 text-left list-disc pl-6">
          <li>Gestionar todos los usuarios</li>
          <li>Ver y crear Guilds</li>
          <li>Supervisar Owners y Spots</li>
        </ul>
      </div>
    </div>
  );
}
