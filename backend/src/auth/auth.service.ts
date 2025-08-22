import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';

type JwtPayload = { sub: number; role: string; type: 'account' | 'access' };

@Injectable()
export class AuthService {
  private pool: Pool;
  constructor(private jwtService: JwtService) {
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
  private assertEmail(email: string) {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestException('Email inválido');
    }
  }
  private assertPassword(password: string) {
    if (!password || password.length < 8) {
      throw new BadRequestException(
        'La contraseña debe tener al menos 8 caracteres',
      );
    }
  }
  private async findAccountByEmail(email: string) {
    let res = await this.pool.query('SELECT * FROM accounts WHERE email=$1', [
      email,
    ]);
    if (res.rows.length > 0)
      return { ...res.rows[0], type: 'account' as const };
    res = await this.pool.query('SELECT * FROM access WHERE email=$1', [email]);
    if (res.rows.length > 0) return { ...res.rows[0], type: 'access' as const };
    return null;
  }
  private async findUserById(id: number) {
    const res = await this.pool.query('SELECT * FROM users WHERE id=$1', [id]);
    return res.rows[0] ?? null;
  }
  private signAccessToken(account: any) {
    const payload: JwtPayload = {
      sub: account.id,
      role: account.role,
      type: account.type,
    };
    const token = this.jwtService.sign(payload);
    const decoded: any = this.jwtService.decode(token);
    return {
      access_token: token,
      expires_at: decoded?.exp,
      type: account.type,
    };
  }
  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      let account: any;
      if (payload.type === 'account') {
        const res = await this.pool.query(
          'SELECT * FROM accounts WHERE id=$1',
          [payload.sub],
        );
        account = res.rows[0];
      } else {
        const res = await this.pool.query('SELECT * FROM access WHERE id=$1', [
          payload.sub,
        ]);
        account = res.rows[0];
      }
      if (!account) throw new UnauthorizedException('Cuenta no válida');
      const user = await this.findUserById(account.user_id);
      if (!user) throw new UnauthorizedException('Usuario no válido');
      return {
        success: true,
        payload,
        account: { id: account.id, email: account.email, role: account.role },
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      };
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
  async meFromAuthHeader(authorization?: string) {
    if (!authorization?.startsWith('Bearer '))
      throw new UnauthorizedException('Falta token');
    const token = authorization.slice('Bearer '.length);
    return this.verifyToken(token);
  }
  async register(user: any, account: any) {
    if (!user || !account) throw new BadRequestException('Payload inválido');
    const { first_name, last_name, address, phone } = user;
    const { email, password } = account;
    this.assertEmail(email);
    this.assertPassword(password);
    const existing = await this.findAccountByEmail(email);
    if (existing) throw new BadRequestException('Email ya registrado');
    const newUser = await this.pool.query(
      `INSERT INTO users (first_name, last_name, address, phone)
       VALUES ($1,$2,$3,$4) RETURNING id`,
      [first_name, last_name, address || null, phone || null],
    );
    const password_hash = await bcrypt.hash(password, 12);
    await this.pool.query(
      `INSERT INTO accounts (email, password_hash, user_id)
       VALUES ($1,$2,$3)`,
      [email, password_hash, newUser.rows[0].id],
    );
    return { success: true, message: 'Usuario registrado correctamente' };
  }
  async login(email: string, password: string) {
    this.assertEmail(email);
    if (!password) throw new BadRequestException('Password requerido');
    const account = await this.findAccountByEmail(email);
    if (!account) throw new UnauthorizedException('Credenciales inválidas');
    const valid = await bcrypt.compare(password, account.password_hash);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');
    return this.signAccessToken(account);
  }
}
