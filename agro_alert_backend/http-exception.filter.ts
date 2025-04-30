// http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlContextType } from '@nestjs/graphql'; // GraphQL importu

@Catch() // Tüm hataları yakala
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {

      // GraphQL bağlamını kontrol et
      if (host.getType<GqlContextType>() === 'graphql') {
          console.error('GraphQL Exception caught by filter:', exception.message);

          // HttpException ise, yeniden fırlat ki NestJS'in GraphQL hata işleyicisi
          // bunu 'errors' dizisine uygun formatta eklesin.
          if (exception instanceof HttpException) {
               throw exception;
          } else {
               // Diğer beklenmedik hatalar için de orijinal hatayı fırlatmak genellikle en iyisidir.
               // NestJS bunu genellikle bir Internal Server Error olarak formatlayacaktır.
               console.error('Unhandled non-HTTP exception in GraphQL context:', exception);
               throw exception;
          }
          // !!! BURADA response.status() KULLANMA !!!
      } else {
          // --- REST API (HTTP) için kodunuz ---
          const ctx = host.switchToHttp();
          const response = ctx.getResponse();
          const request = ctx.getRequest();

          const status =
              exception instanceof HttpException
                  ? exception.getStatus()
                  : HttpStatus.INTERNAL_SERVER_ERROR;

          const message =
              exception instanceof HttpException
                  ? exception.getResponse()
                  : 'Internal server error occurred';

           if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
               console.error('HTTP Internal Server Error:', exception.stack);
           }

           // response objesinin ve status fonksiyonunun varlığını kontrol et
           if (response && typeof response.status === 'function') {
               response.status(status).json({
                   statusCode: status,
                   timestamp: new Date().toISOString(),
                   path: request?.url,
                   error: typeof message === 'string' ? message : (message as any)?.message || 'Error',
                   details: typeof message === 'object' ? message : undefined,
               });
           } else {
               console.error('Cannot set status on response object for HTTP request.');
           }
          // --- REST API Kodu Bitişi ---
      }
  }
}