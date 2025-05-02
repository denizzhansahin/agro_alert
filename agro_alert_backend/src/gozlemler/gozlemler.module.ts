// src/gozlemler/gozlemler.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GozlemlerService } from './gozlemler.service';
import { Gozlemler } from 'src/Entities/gozlemler';
import { CihazKullanici } from 'src/Entities/cihaz_kullanici';
import { Cihazlar } from 'src/Entities/cihazlar';
import { Tespitler } from 'src/Entities/tespitler';
import { GozlemlerResolver } from 'src/GraphQl/GozlemlerQuery';
import { CihazKullaniciService } from 'src/cihaz_kullanici/cihaz_kullanici.service';
import { KullanicilarModule } from 'src/kullanicilar/kullanicilar.module';
import { CihazKullaniciModule } from 'src/cihaz_kullanici/cihaz_kullanici.module';
import { CihazlarModule } from 'src/cihazlar/cihazlar.module';
import { Kullanici } from 'src/Entities/kullanici';
import { CihazlarService } from 'src/cihazlar/cihazlar.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gozlemler, CihazKullanici, Cihazlar, Tespitler,Kullanici]),
    KullanicilarModule, // Add KullaniciModule to imports
    CihazKullaniciModule,
    CihazlarModule
  ],
  providers: [GozlemlerService, GozlemlerResolver, CihazKullaniciService,CihazlarService],
  exports: [GozlemlerService],
})
export class GozlemlerModule {}