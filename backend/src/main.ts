/**
 * =====================================================
 *  NAME    : main.ts
 *  DESCRIPTION: create server
 * =====================================================
 */

// DEPENDENCIES
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// EXEC
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  await app.listen(3000);
}

void bootstrap();
