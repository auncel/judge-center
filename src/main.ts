import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/common/enums/transport.enum';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      retryAttempts: 3,
    }
  });
  await app.listen(() => console.log('[micro service][judge center]: starting!'));
}

bootstrap();
