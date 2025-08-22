/**
 * =====================================================
 *  NAME    : server.controler.ts
 *  DESCRIPTION: server controller
 * =====================================================
 */

// DEPENDENCIES
import { Controller, Get, Param } from '@nestjs/common';
import { ServerService } from './server.service';

// CONTROLLER
@Controller()
export class ServerController {
  constructor(private readonly serverService: ServerService) {}
  // STATUS SERVER
  @Get('/')
  checkService() {
    return {
      message: 'Backend activo',
      framework: 'NestJS',
      runtime: 'Node.js',
      packageManager: 'npm',
      language: 'TypeScript',
      timestamp: new Date().toISOString(),
    };
  }
  // GET LVL
  @Get('roles')
  async getRoles() {
    return await this.serverService.getRoles();
  }
  // GET ID
  @Get('hierarchy/:accountId')
  async getHierarchy(@Param('accountId') accountId: number) {
    return await this.serverService.getHierarchy(accountId);
  }
}
