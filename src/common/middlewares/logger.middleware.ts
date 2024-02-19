import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = winston.createLogger({
    // 특별한 설정을 적용할 수 있습니다.
    format: winston.format.simple(),
    transports: [
      new winston.transports.Console(),
      // 다른 transports를 필요에 따라 추가할 수 있습니다.
    ],
  });

  use(req: Request, res: Response, next: NextFunction) {
    // 특정 컨트롤러에 대한 로깅 로직을 작성합니다.
    

    // 다음 미들웨어 또는 핸들러로 요청을 전달합니다.
    next();
  }
}
