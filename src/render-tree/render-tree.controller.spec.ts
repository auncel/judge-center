import { Test, TestingModule } from '@nestjs/testing';
import { RenderTreeController } from './render-tree.controller';

describe('RenderTree Controller', () => {
  let controller: RenderTreeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RenderTreeController],
    }).compile();

    controller = module.get<RenderTreeController>(RenderTreeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
