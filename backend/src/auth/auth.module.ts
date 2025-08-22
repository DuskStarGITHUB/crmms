/**
 * =====================================================
 *  NAME    : auth.module.ts
 *  DESCRIPTION: auth module
 * =====================================================
 */

// DEPENDENCIES
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

// MODULE
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'Sup3rS3cr3tJWT!',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN ?? '4hr' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
