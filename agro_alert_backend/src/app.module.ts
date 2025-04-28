import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { KullanicilarModule } from './kullanicilar/kullanicilar.module';
import { KullaniciGraphQl } from './GraphQl/KullaniciQuery';
import { Kullanici } from './Entities/kullanici';
import { CihazKullanici } from './Entities/cihaz_kullanici';
import { Cihazlar } from './Entities/cihazlar';
import { Gozlemler } from './Entities/gozlemler';
import { Tespitler } from './Entities/tespitler';
import { Uyarilar } from './Entities/uyarilar';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      playground: true, // GraphQL Playground'u etkinleştir
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      synchronize: true,
      //logging: true,
      entities: [Kullanici,CihazKullanici,Cihazlar,Gozlemler,Tespitler,Uyarilar],
    }),

    AuthModule,
    KullanicilarModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    KullaniciGraphQl,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Tüm endpoint'leri JWT ile koru
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Rol tabanlı koruma
    },
  ],
})
export class AppModule {}