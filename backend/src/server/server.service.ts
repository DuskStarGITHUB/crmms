/**
 * =====================================================
 *  NAME    : server.service.ts
 *  DESCRIPTION: server service
 * =====================================================
 */
// DEPENDENCIES
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

// BD AND CONFIGURATIONS FOR SERVER
@Injectable()
export class ServerService {
  // ENVIROMENT
  private pool: Pool;
  constructor(private configService: ConfigService) {
    this.pool = new Pool({
      user: this.configService.get<string>('POSTGRES_USER'),
      host: this.configService.get<string>('POSTGRES_HOST'),
      database: this.configService.get<string>('POSTGRES_DB'),
      password: this.configService.get<string>('POSTGRES_PASSWORD'),
      port: Number(this.configService.get<number>('POSTGRES_PORT') ?? 5432),
    });
    this.initDB().catch(console.error);
  }
  // BD
  private async initDB() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        level INT NOT NULL
      );
    `);
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE,
        phone VARCHAR(20),
        address VARCHAR(255)
      );
    `);
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        role_id INT REFERENCES roles(id),
        password_hash VARCHAR(255) NOT NULL,
        created_by_account_id INT REFERENCES accounts(id)
      );
    `);
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS guilds (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        owner_account_id INT REFERENCES accounts(id)
      );
    `);
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS spots (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        guild_id INT REFERENCES guilds(id) ON DELETE CASCADE,
        owner_account_id INT REFERENCES accounts(id)
      );
    `);
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS builders (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        spot_id INT REFERENCES spots(id) ON DELETE CASCADE
      );
    `);
    const roles = [
      { name: 'admin', level: 0 },
      { name: 'mod', level: 1 },
      { name: 'access_owner', level: 2 },
      { name: 'guild', level: 3 },
      { name: 'spot', level: 4 },
      { name: 'builder', level: 5 },
      { name: 'user', level: 6 },
    ];
    for (const r of roles) {
      await this.pool.query(
        `INSERT INTO roles(name,level) VALUES($1,$2) ON CONFLICT(name) DO NOTHING`,
        [r.name, r.level],
      );
    }
    // ADMIN DEFAULT
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@crmms.com';
    const adminPass = process.env.ADMIN_PASS || 'C1R2M!0MlS';
    const exists = await this.pool.query(`
      SELECT * FROM accounts a JOIN roles r ON a.role_id=r.id WHERE r.name='admin'
    `);
    if (exists.rows.length === 0) {
      const newUser = await this.pool.query(
        `INSERT INTO users(first_name,last_name,email) VALUES($1,$2,$3) RETURNING id`,
        ['Admin', 'CRM', adminEmail],
      );
      const hash = await bcrypt.hash(adminPass, 12);
      const roleId = (
        await this.pool.query(`SELECT id FROM roles WHERE name='admin'`)
      ).rows[0].id;
      await this.pool.query(
        `INSERT INTO accounts(user_id,role_id,password_hash) VALUES($1,$2,$3)`,
        [newUser.rows[0].id, roleId, hash],
      );
      console.log('✅ Admin inicial creado:', adminEmail, '/', adminPass);
    }
  }
  // METHODS UTIL
  async getRoles() {
    const res = await this.pool.query('SELECT * FROM roles ORDER BY level ASC');
    return res.rows;
  }
  async getHierarchy(accountId: number) {
    const account = await this.pool.query(
      'SELECT a.id,a.user_id,a.role_id,r.name as role_name FROM accounts a JOIN roles r ON a.role_id=r.id WHERE a.id=$1',
      [accountId],
    );
    if (account.rows.length === 0)
      throw new BadRequestException('Cuenta no encontrada');
    const acc = account.rows[0];
    const hierarchy: any = {
      account: acc,
      guilds: [],
      spots: [],
      builders: [],
    };
    if (acc.role_name === 'access_owner') {
      const guilds = await this.pool.query(
        'SELECT * FROM guilds WHERE owner_account_id=$1',
        [acc.id],
      );
      hierarchy.guilds = guilds.rows;
      for (const g of guilds.rows) {
        const spots = await this.pool.query(
          'SELECT * FROM spots WHERE guild_id=$1',
          [g.id],
        );
        g.spots = spots.rows;
        for (const s of spots.rows) {
          const builders = await this.pool.query(
            'SELECT b.*,u.first_name,u.last_name FROM builders b JOIN users u ON b.user_id=u.id WHERE spot_id=$1',
            [s.id],
          );
          s.builders = builders.rows;
        }
      }
    }
    return hierarchy;
  }
}
