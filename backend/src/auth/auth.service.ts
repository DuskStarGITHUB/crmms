/**
 * =====================================================
 *  NAME    : auth.service.ts
 *  DESCRIPTION: auth service
 * =====================================================
 */

// DEPENDENCIES
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

// LOGIC
type JwtPayload = { sub: number; role: string; type: 'account' | 'access' };

// SERVICE
@Injectable()
export class AuthService {
  // ENVIROMENT
  private pool: Pool;
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.pool = new Pool({
      user: this.configService.get<string>('POSTGRES_USER'),
      host: this.configService.get<string>('POSTGRES_HOST'),
      database: this.configService.get<string>('POSTGRES_DB'),
      password: this.configService.get<string>('POSTGRES_PASSWORD'),
      port: Number(this.configService.get<number>('POSTGRES_PORT') ?? 5432),
    });
  }
  // VERIFY EMAIL
  private assertEmail(email: string) {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestException('Email inválido');
    }
  }
  // VALID PASSWORD
  private assertPassword(password: string) {
    if (!password || password.length < 8) {
      throw new BadRequestException(
        'La contraseña debe tener al menos 8 caracteres',
      );
    }
  }
  // FIND ACCOUNT IN DB
  private async findAccountByEmail(email: string) {
    const res = await this.pool.query(
      `SELECT a.*, r.name AS role_name, u.email
       FROM accounts a
       JOIN roles r ON a.role_id = r.id
       JOIN users u ON a.user_id = u.id
       WHERE u.email = $1`,
      [email],
    );
    return res.rows[0] ?? null;
  }
  // FIND USER IN DB
  private async findUserById(id: number) {
    const res = await this.pool.query('SELECT * FROM users WHERE id = $1', [
      id,
    ]);
    return res.rows[0] ?? null;
  }
  // GENERATE TOKEN
  private signAccessToken(account: any) {
    const payload: JwtPayload = {
      sub: account.id,
      role: account.role_name,
      type: 'account',
    };
    const token = this.jwtService.sign(payload);
    const decoded: any = this.jwtService.decode(token);
    return {
      access_token: token,
      expires_at: decoded?.exp,
      type: 'account',
    };
  }
  // VALID TOKEN
  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      const res = await this.pool.query(
        `SELECT a.*, r.name AS role_name, u.email
         FROM accounts a
         JOIN roles r ON a.role_id = r.id
         JOIN users u ON a.user_id = u.id
         WHERE a.id = $1`,
        [payload.sub],
      );
      const account = res.rows[0];
      if (!account) throw new UnauthorizedException('Cuenta no válida');
      const user = await this.findUserById(account.user_id);
      if (!user) throw new UnauthorizedException('Usuario no válido');
      return {
        success: true,
        payload,
        account: {
          id: account.id,
          email: user.email,
          role: account.role_name,
        },
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          address: user.address,
        },
      };
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
  // VALID TOKEN
  async meFromAuthHeader(authorization?: string) {
    if (!authorization?.startsWith('Bearer '))
      throw new UnauthorizedException('Falta token');
    const token = authorization.slice('Bearer '.length);
    return this.verifyToken(token);
  }
  // REGISTER USER
  async register(
    user: {
      first_name: string;
      last_name: string;
      address?: string;
      phone?: string;
      email: string;
    },
    account: {
      password: string;
      role_name?: string;
      created_by?: number;
    },
  ) {
    const { first_name, last_name, address, phone, email } = user;
    const { password, role_name, created_by } = account;
    this.assertEmail(email);
    this.assertPassword(password);
    const existing = await this.findAccountByEmail(email);
    if (existing) throw new BadRequestException('Email ya registrado');
    const newUser = await this.pool.query(
      `INSERT INTO users(first_name,last_name,address,phone,email)
       VALUES($1,$2,$3,$4,$5) RETURNING id`,
      [first_name, last_name, address || null, phone || null, email],
    );
    const password_hash = await bcrypt.hash(password, 12);
    const roleRes = await this.pool.query(
      'SELECT id FROM roles WHERE name = $1',
      [role_name || 'user'],
    );
    if (roleRes.rows.length === 0)
      throw new BadRequestException('Role no válido');
    const roleId = roleRes.rows[0].id;
    // CREATE ACCOUNT
    const res = await this.pool.query(
      `INSERT INTO accounts(user_id,role_id,password_hash,created_by_account_id)
       VALUES($1,$2,$3,$4) RETURNING id`,
      [newUser.rows[0].id, roleId, password_hash, created_by || null],
    );
    return { success: true, account: { id: res.rows[0].id, email } };
  }
  // LOGIN
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
