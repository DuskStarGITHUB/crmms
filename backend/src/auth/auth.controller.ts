import {
  Controller,
  Post,
  Body,
  Get,
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() body: any) {
    try {
      const { user, account } = body;
      return await this.authService.register(user, account);
    } catch (err: any) {
      throw new HttpException(
        err.message || 'Error en registro',
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      return await this.authService.login(body.email, body.password);
    } catch (err: any) {
      throw new HttpException(
        err.message || 'Credenciales inválidas',
        err.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }
  @Get('me')
  async me(@Headers('authorization') authorization?: string) {
    try {
      return await this.authService.meFromAuthHeader(authorization);
    } catch (err: any) {
      throw new HttpException(
        err.message || 'Token inválido',
        err.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }
  @Post('verify')
  async verify(@Body() body: { token: string }) {
    try {
      return await this.authService.verifyToken(body.token);
    } catch (err: any) {
      throw new HttpException(
        err.message || 'Token inválido',
        err.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
