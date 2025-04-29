import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kullanici } from '../Entities/kullanici'; 

import { KullaniciGraphQl } from 'src/GraphQl/KullaniciQuery';
import { CihazKullanici } from 'src/Entities/cihaz_kullanici';
import { Cihazlar } from 'src/Entities/cihazlar';
import { Gozlemler } from 'src/Entities/gozlemler';
import { Tespitler } from 'src/Entities/tespitler';
import { Uyarilar } from 'src/Entities/uyarilar';
import { KullaniciService } from './kullanicilar.service';
@Module({
  providers: [KullaniciService,KullaniciGraphQl],
  exports: [KullaniciService], 
  imports:[
    TypeOrmModule.forFeature([Kullanici,CihazKullanici,Cihazlar,Gozlemler,Tespitler,Uyarilar]),
  ]

})
export class KullanicilarModule {}
