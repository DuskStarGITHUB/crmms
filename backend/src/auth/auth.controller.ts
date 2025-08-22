import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    try {
      return await this.authService.register(body.user, body.account);
    } catch (err: any) {
      throw new HttpException(
        err.message ?? 'Bad Request',
        err.status ?? HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      return await this.authService.login(body.email, body.password);
    } catch (err: any) {
      throw new HttpException(
        err.message ?? 'Unauthorized',
        err.status ?? HttpStatus.UNAUTHORIZED,
      );
    }
  }

  // Para autologin/validación desde el frontend con Authorization: Bearer <token>
  @Get('me')
  async me(@Headers('authorization') authorization?: string) {
    try {
      return await this.authService.meFromAuthHeader(authorization);
    } catch (err: any) {
      throw new HttpException(
        err.message ?? 'Unauthorized',
        err.status ?? HttpStatus.UNAUTHORIZED,
      );
    }
  }

  // Alternativa si prefieres enviar el token en el body (evita problemas con preflight)
  @Post('verify')
  async verify(@Body() body: { token: string }) {
    try {
      return await this.authService.verifyToken(body.token);
    } catch (err: any) {
      throw new HttpException(
        err.message ?? 'Unauthorized',
        err.status ?? HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
