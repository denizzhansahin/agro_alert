// http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Hata türüne göre durum kodunu belirle
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // Hata mesajını al
    const message = exception.response?.message || exception.message || 'Beklenmeyen hata';

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}


/*


// http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // Hata yanıtını özelleştirin
    const response = host.switchToHttp().getResponse();
    response.status(401).json({
      statusCode: 401,
      message: exception.message || 'Yetkilendirme hatası',
    });
  }
}
  */