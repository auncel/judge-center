import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/common/enums/transport.enum';
import { MICRO_SERVICE_TCP_HOST, MICRO_SERVICE_TCP_PORT } from './config/index'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3300, () => console.log('[micro service][judge center]: starting!'));
}

bootstrap();
