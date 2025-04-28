// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from 'http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);



  // Global Exception Filter (Özelleştirilmiş hata yönetimi)
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS Ayarları (Geniş erişim için)
  // main.ts
  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
    methods: '*', // Tüm HTTP metodları
    credentials: true,
  });

  // Uygulamayı belirtilen portta başlat
  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`🚀 Uygulama http://localhost:${port} üzerinde çalışıyor`);
}

bootstrap();
/*
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from 'http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: '*',
    allowedHeaders: ['Authorization', 'Content-Type'], // Authorization ekleyin
    exposedHeaders: ['Authorization'], // İsteğe bağlı: Client'ın görmesi için
    credentials: true, // İsteğe bağlı: Cookie/Token kullanıyorsanız
  });
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
*/