import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/common/enums/transport.enum';
import { MICRO_SERVICE_TCP_HOST, MICRO_SERVICE_TCP_PORT } from './config/index'

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: MICRO_SERVICE_TCP_HOST,
      port: MICRO_SERVICE_TCP_PORT,
      retryAttempts: 3,
    },
  });
  await app.listen(() => console.log('[micro service][judge center]: starting!'));
}

bootstrap();
