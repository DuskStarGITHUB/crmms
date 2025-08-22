/**
 * =====================================================
 *  NAME    : server.module.ts
 *  DESCRIPTION: server create
 * =====================================================
 */

// DEPENDENCIES
import { Module } from '@nestjs/common';
import { ServerController } from './server.controller';
import { ServerService } from './server.service';

// MODULE
@Module({
  controllers: [ServerController],
  providers: [ServerService],
})
export class ServerModule {}
