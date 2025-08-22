/**
 * =====================================================
 *  NAME    : app.module.ts
 *  DESCRIPTION: server join modules
 * =====================================================
 */

// DEPENDENCIES
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServerModule } from './server/server.module';
import { AuthModule } from './auth/auth.module';


// MODULES
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServerModule,
    AuthModule,
  ],
})
export class AppModule {}