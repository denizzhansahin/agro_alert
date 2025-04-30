// src/gozlemler/gozlemler.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GozlemlerService } from './gozlemler.service';
import { Gozlemler } from 'src/Entities/gozlemler';
import { CihazKullanici } from 'src/Entities/cihaz_kullanici';
import { Cihazlar } from 'src/Entities/cihazlar';
import { Tespitler } from 'src/Entities/tespitler';
import { GozlemlerResolver } from 'src/GraphQl/GozlemlerQuery';


@Module({
  imports: [
    TypeOrmModule.forFeature([Gozlemler, CihazKullanici, Cihazlar,Tespitler]) // Cihazlar'ı ekle
  ],
  providers: [GozlemlerService,GozlemlerResolver],
  exports: [GozlemlerService]
})
export class GozlemlerModule {}