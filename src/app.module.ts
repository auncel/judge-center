import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RenderTreeModule } from './render-tree/render-tree.module';
import { JudgeModule } from './judge/judge.module';

@Module({
  imports: [ConfigModule, RenderTreeModule, JudgeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
