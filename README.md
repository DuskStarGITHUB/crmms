# CRMMS - Customer Relationship Management Master System

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

<img width="1561" height="893" alt="image" src="https://github.com/user-attachments/assets/4ec5024c-e35a-4110-9073-3f687b099997" />

## ¿Qué es CRMMS?

**CRMMS** (Customer Relationship Management Master System) es un sistema integral de gestión de relaciones con clientes diseñado para optimizar y centralizar todas las interacciones con clientes en una plataforma moderna y escalable.

> Un CRM es esencial para cualquier empresa que busque mejorar sus procesos de ventas, marketing y atención al cliente, permitiendo un seguimiento organizado de leads, clientes y oportunidades de negocio.

### Funcionalidades Principales

- **🔐 Autenticación Segura**: Sistema de registro y login con JWT
- **👥 Gestión de Clientes**: Almacenamiento y organización centralizada de información de clientes
- **📊 Dashboard Interactivo**: Visualización de métricas y KPIs importantes
- **📈 Seguimiento de Ventas**: Monitorización del pipeline de ventas y conversiones
- **🎨 Interfaz Moderna**: Diseño responsive con temas claros y oscuros
- **⚡ Alto Rendimiento**: Construido con las últimas tecnologías para máxima eficiencia

## Tecnologías Utilizadas

### Frontend

- **React 18** con TypeScript
- **Vite** para build tooling ultrarrápido
- **TailwindCSS** para estilos
- **shadcn/ui** para componentes de UI
- **React Router** para navegación

### Backend

- **NestJS** framework de Node.js
- **TypeScript** para type safety
- **JWT** para autenticación
- **PostgreSQL** como base de datos principal

### Herramientas de Desarrollo

- **ESLint** para linting de código
- **Hot reload** para desarrollo ágil

## Instalacion y Configuracion

Sigue estos pasos para configurar el proyecto localmente:

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/DuskStarGITHUB/crmms
   cd crmms
   ```

2. **Instalar dependencias raíz**

   ```bash
   npm install
   ```

3. **Instalar dependencias de backend y frontend**

   ```bash
   npm run init
   ```

4. **Configurar variables de entorno**

   ```bash
   # Crear archivo .env en el resource auth de nestjs:
   POSTGRES_USER=tu_usuario
   POSTGRES_PASSWORD=tu_contraseña
   POSTGRES_DB=nombre_base_datos
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   JWT_SECRET=tu_jwt_secreto_super_seguro
   ```

5. **Configurar de BD**

   ```bash
   # Modificar logica en el servicio/module server y de nestjs para tu BD:
   this.pool = new Pool({
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST ,
      database: process.env.POSTGRES_DB ,
      password: process.env.POSTGRES_PASSWORD ,
      port: Number(process.env.POSTGRES_PORT ?? 5432),
    });
   # Usuario de Accesso por defecto en tu BD
   private async initAdmin() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@crmms.com';
    const adminPass = process.env.ADMIN_PASS || 'C1R2M!0MlS';
    }
    # Tiempo y Key JWT
    JwtModule.register(
      secret: process.env.JWT_SECRET ?? 'Sup3rS3cr3tJWT!',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN ?? '4hr' },
    }),
   ```

6. **Ejecutar en modo desarrollo**
   ```bash
   npm run stack
   ```

---

# Cuentas y Roles en la Base de Datos

En la base de datos se crean principalmente las tablas **Access** y **Accounts**, que representan distintos tipos de credenciales en el CRM.

---

## Jerarquía General (Esquema)

```
Admin
└─ Moderador (Mod)
  └─ Access Owner
    └─ Guild (empresa)
      └─ Spot (jefe de área/sector)
        └─ Builder (usuario normal del CRM)
─ User (registro independiente)
```

---

## Roles de Administración del Entorno

### Admin

- Máximo rango del CRM.
- Puede crear **Moderadores** (mods).
- Puede ver, editar y administrar todas las **Access Owner** y sus subcuentas (Guilds, Spots y Builders).
- No utiliza herramientas normales del CRM (reportes de empresa, facturas, etc.).
- Funciones: supervisión completa del sistema, gestión de mods y Owners.

### Moderador (Mod)

- Permisos casi iguales al Admin pero limitado a los **Access Owner** que él creó.
- Cada mod solo puede administrar los Owners que haya creado y sus respectivas subcuentas.
- Funciones:
  - Ver reportes de fallos y tickets.
  - Administrar cuentas de Guilds, Spots y Builders que pertenezcan a los Owners que creó.
- No puede usar el CRM como usuario normal.

---

## Roles de Administración de Servicio

### Access Owner

- Representa la “administración de servicio”.
- Puede crear **Guilds** (empresas).
- Cada Guild puede tener varios **Spots**.
- Cada Spot puede tener varios **Builders**.
- Funciones:
  - Crear y gestionar Guilds y sus Spots y Builders.
  - Supervisar información independiente de cada Guild.
- Limitación: los Access Owner administran solo las cuentas bajo su creación.

### Guild

- Representa lógicamente una empresa en la base de datos.
- Funciona como contenedor de Spots y Builders.
- No tiene “actividad directa” sino que es una representación lógica.

### Spot (Account)

- Jefe de área, sector o departamento dentro de una Guild.
- Funciones:
  - Puede crear y gestionar Builders bajo su Spot.
  - Acceso a información y reportes de su área (ejemplo: contabilidad, almacén).
- Limitación: solo puede ver y administrar su área específica.

### Builder (Account)

- Usuario normal del CRM.
- Funciones:
  - Uso normal del CRM según su área asignada por el Spot.
  - Ejemplo: manejar gastos, facturas, entradas y salidas de dinero de su sector.

### User (Account)

- Registro independiente, fuera de la jerarquía de Guild.
- Funciones básicas: ver reportes públicos de alguna Guild.

---

## Resumen de la Jerarquía (Escalera)

- **Admin** → supervisión total.
- **Moderador (Mod)** → supervisión limitada a Owners que creó.
- **Access Owner** → administra Guilds y crea Spots y Builders.
- **Guild** → contenedor lógico de Spots y Builders.
- **Spot** → jefe de área, puede crear Builders y ver información de su sector.
- **Builder** → usuario normal del CRM, limitado a su Spot.
- **User** → cuenta independiente, acceso básico a información pública.
