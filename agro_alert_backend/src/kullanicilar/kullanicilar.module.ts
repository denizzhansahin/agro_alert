import { Module } from '@nestjs/common';
import { KullanicilarService } from './kullanicilar.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kullanici } from '../Entities/kullanici'; 

import { KullaniciGraphQl } from 'src/GraphQl/KullaniciQuery';
import { CihazKullanici } from 'src/Entities/cihaz_kullanici';
@Module({
  providers: [KullanicilarService,KullaniciGraphQl],
  exports: [KullanicilarService], 
  imports:[
    TypeOrmModule.forFeature([Kullanici,CihazKullanici]),
  ]

})
export class KullanicilarModule {}
