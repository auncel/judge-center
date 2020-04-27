import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request } from 'express';
import { LoggerService } from './logger/logger.service';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  logger: LoggerService = new LoggerService(RequestMiddleware.name);

   use(req: Request, res: any, next: () => void) {
    this.logger.log(`[${req.method}] ${req.originalUrl} param: ${JSON.stringify(req.params || {})} body: ${JSON.stringify(req.body || {})}`, RequestMiddleware.name);
    next();
  }
}
