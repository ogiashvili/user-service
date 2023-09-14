import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ApiException } from './api-exception';
import { Response as ExpressResponse } from 'express';

@Catch(ApiException)
export class ExceptionHandler implements ExceptionFilter {
  catch(exception: ApiException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<ExpressResponse>();
    response.status(HttpStatus.BAD_REQUEST).json({
      errors: [
        {
          keyword: exception.keyword,
          message: exception.message,
        },
      ],
    });
  }
}

@Catch(Array<ApiException>)
export class ExceptionHandler1 implements ExceptionFilter {
  catch(exception: Array<ApiException>, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<ExpressResponse>();

    response.status(HttpStatus.BAD_REQUEST).json({
      errors: exception,
    });
  }
}
