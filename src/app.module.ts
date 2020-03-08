import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RenderTreeModule } from './render-tree/render-tree.module';

@Module({
  imports: [ConfigModule, RenderTreeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
