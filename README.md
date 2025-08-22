# CRMMS - Customer Relationship Management Master System

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Índice

- [¿Qué es CRMMS?](#-qué-es-crmms)
- [Características Principales](#-funcionalidades-principales)
- [🛠️ Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [📦 Instalación y Configuración](#-instalacion-y-configuracion)

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
   # Modificar logica en el servicio auth de nestjs para tu BD:
   this.pool = new Pool({
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST ,
      database: process.env.POSTGRES_DB ,
      password: process.env.POSTGRES_PASSWORD ,
      port: Number(process.env.POSTGRES_PORT ?? 5432),
    });
    this.initTables()
      .then(() => this.initAdmin())
      .catch((e) => console.error('Error inicializando DB:', e));
   }
   private async initTables() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        address VARCHAR(255),
        phone VARCHAR(20)
      );
    `);
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS access (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'admin',
        user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_by INT REFERENCES users(id)
      );
    `);
   }
   private async initAdmin() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@crmms.com';
    const adminPass = process.env.ADMIN_PASS || 'C1R2M!0MlS';
    const exists = await this.pool.query(
      'SELECT * FROM access WHERE email=$1',
      [adminEmail],
    );
    if (exists.rows.length === 0) {
      const newUser = await this.pool.query(
        `INSERT INTO users (first_name, last_name) VALUES ($1,$2) RETURNING id`,
        ['Admin', 'CRM'],
      );
      const hash = await bcrypt.hash(adminPass, 12);
      await this.pool.query(
        `INSERT INTO access (email, password_hash, role, user_id)
         VALUES ($1,$2,$3,$4)`,
        [adminEmail, hash, 'admin', newUser.rows[0].id],
      );
      console.log('✅ Admin creado:', adminEmail, '/', adminPass);
    }
   }
   ```

6. **Ejecutar en modo desarrollo**
   ```bash
   npm run stack
   ```
