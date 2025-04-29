import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CihazKullaniciService } from './cihaz_kullanici.service';
import { CihazKullanici } from '../Entities/cihaz_kullanici';
import { Kullanici } from '../Entities/kullanici';
import { CihazKullaniciResolver } from 'src/GraphQl/CihazKullaniciQuery';
import { Cihazlar } from 'src/Entities/cihazlar';

@Module({
  imports: [TypeOrmModule.forFeature([CihazKullanici, Kullanici,Cihazlar])],
  providers: [CihazKullaniciService, CihazKullaniciResolver],
})
export class CihazKullaniciModule {}
