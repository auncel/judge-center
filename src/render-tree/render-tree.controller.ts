import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices'
@Controller('render-tree')
export class RenderTreeController {

  @MessagePattern({cmd: 'getRenderTree'})
   generateRenderTree(data: string[]): string {
    return data[0] + '+_+' + data[1];
  }
}
