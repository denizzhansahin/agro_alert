import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CihazlarService } from './cihazlar.service';
import { Cihazlar } from '../Entities/cihazlar';
import { CihazlarGraphQl } from '../GraphQl/CihazlarQuery';
import { Kullanici } from 'src/Entities/kullanici';
import { CihazKullanici } from 'src/Entities/cihaz_kullanici';
import { Gozlemler } from 'src/Entities/gozlemler';
import { Tespitler } from 'src/Entities/tespitler';
import { Uyarilar } from 'src/Entities/uyarilar';

@Module({
  imports: [TypeOrmModule.forFeature([Kullanici,CihazKullanici,Cihazlar,Gozlemler,Tespitler,Uyarilar])],
  providers: [CihazlarService, CihazlarGraphQl],
  exports: [CihazlarService],
})
export class CihazlarModule {}
