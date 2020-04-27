import { Module,  NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RenderTreeModule } from './render-tree/render-tree.module';
import { JudgeModule } from './judge/judge.module';
import { RequestMiddleware } from './request.middleware';
import { JudgeController } from './judge/judge.controller';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [ConfigModule, RenderTreeModule, LoggerModule, JudgeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule   {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestMiddleware)
      .forRoutes(JudgeController);
  }
}
