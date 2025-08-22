import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';

type JwtPayload = { sub: number; role: string };

@Injectable()
export class AuthService {
  private pool: Pool;

  constructor(private jwtService: JwtService) {
    this.pool = new Pool({
      user: process.env.POSTGRES_USER || 'duskstar',
      host: process.env.POSTGRES_HOST || 'localhost',
      database: process.env.POSTGRES_DB || 'crmms',
      password: process.env.POSTGRES_PASSWORD || 'Sup3rS3cr3t!',
      port: Number(process.env.POSTGRES_PORT ?? 5432),
    });
    this.initTables().catch((e) => {
      // evita que la app muera por init; log simple
      // console.error('DB init error:', e);
    });
  }

  private async initTables() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name  VARCHAR(50) NOT NULL,
        address    VARCHAR(100),
        phone      VARCHAR(20)
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
  }

  // ---------- helpers ----------
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
    const res = await this.pool.query('SELECT * FROM accounts WHERE email=$1', [
      email,
    ]);
    return res.rows[0] ?? null;
  }

  private async findUserById(id: number) {
    const res = await this.pool.query('SELECT * FROM users WHERE id=$1', [id]);
    return res.rows[0] ?? null;
  }

  private async findAccountUserByAccountId(accountId: number) {
    const accRes = await this.pool.query('SELECT * FROM accounts WHERE id=$1', [
      accountId,
    ]);
    const account = accRes.rows[0];
    if (!account) return { account: null, user: null };
    const user = await this.findUserById(account.user_id);
    return { account, user };
  }

  private signAccessToken(account: any) {
    const payload: JwtPayload = { sub: account.id, role: account.role };
    const token = this.jwtService.sign(payload);
    // exp/iat para frontend UX
    const decoded: any = this.jwtService.decode(token);
    return {
      access_token: token,
      expires_at: decoded?.exp ? decoded.exp : undefined,
    };
  }

  // ---------- public API ----------
  async register(user: any, account: any) {
    if (!user || !account) throw new BadRequestException('Payload inválido');

    const { first_name, last_name, address, phone } = user;
    const { email, password } = account;

    if (!first_name || !last_name) {
      throw new BadRequestException('Nombre y apellido son requeridos');
    }
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

    const token = this.signAccessToken(account);
    return { success: true, ...token };
  }

  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      const { account, user } = await this.findAccountUserByAccountId(
        payload.sub,
      );
      if (!account || !user)
        throw new UnauthorizedException('Cuenta no válida');
      return {
        success: true,
        payload,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
        },
        account: {
          id: account.id,
          email: account.email,
          role: account.role,
        },
      };
    } catch (_e) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  async meFromAuthHeader(authorization?: string) {
    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Falta token');
    }
    const token = authorization.slice('Bearer '.length);
    return this.verifyToken(token);
  }
}
