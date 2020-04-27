import { NestFactory } from '@nestjs/core';
import { Request } from 'express';
import timeout from 'connect-timeout';
import debug from 'debug';
import { AppModule } from './app.module';

const log = debug('auncel:judge:main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['api.auncel.top', 'www.auncel.top'],
    methods: "ALL",
    credentials: true,
  });
  app.use(timeout('60s'));
  app.use((req: Request, res: Response, next: () => void) => {
    log('halt on timedout');
    if (!(req as any).timedout) {
      next();
    }
  });
  await app.listen(3300, () => console.log('[judge center]: starting!'));
}

bootstrap();
