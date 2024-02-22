import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BusinessException, ErrorDomain } from './BusinessException';
import { Request, Response } from 'express';

export class ApiError {
  id: string;
  domain: ErrorDomain;
  message: string;
  apiMessage?: string;
  timestamp: Date;
}

@Catch(Error)
export class BusinessExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BusinessExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    let body: ApiError;
    let status: HttpStatus;

    if (exception instanceof BusinessException) {
      status = exception.status;
      body = {
        id: exception.id,
        domain: exception.domain,
        message: exception.message,
        apiMessage: exception.apiMessage,
        timestamp: exception.timestamp,
      };
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      body = new BusinessException(
        'generic',
        exception.message,
        exception.message,
        status,
      );
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      body = new BusinessException(
        'generic',
        `INTERNAL_SERVER_ERROR: ${exception.message}`,
        'INTERNAL_SERVER_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    this.logger.error(
      `exception: ${JSON.stringify({
        path: request.url,
        ...body,
      })}`,
    );
    response.status(status).json({...body});
  }
}
