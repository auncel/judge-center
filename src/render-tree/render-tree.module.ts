import { Module } from '@nestjs/common';
import { RenderTreeController } from './render-tree.controller';

@Module({
  controllers: [RenderTreeController]
})
export class RenderTreeModule {}
