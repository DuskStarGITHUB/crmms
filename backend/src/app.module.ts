/**
 * =====================================================
 *  NAME    : app.module.ts
 *  DESCRIPTION: server join modules
 * =====================================================
 */

// DEPENDENCIES
import { Module } from '@nestjs/common';
import { ServerModule } from './server/server.module';
import { AuthModule } from './auth/auth.module';

// MODULES
@Module({
  imports: [ServerModule, AuthModule],
})
export class AppModule {}
