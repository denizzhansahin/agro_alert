import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TespitlerService } from './tespitler.service';import { Tespitler } from 'src/Entities/tespitler';
import { Gozlemler } from 'src/Entities/gozlemler';
import { TespitlerResolver } from 'src/GraphQl/TespitQuery';
import { Uyarilar } from 'src/Entities/uyarilar';


@Module({
  imports: [

    TypeOrmModule.forFeature([
        Tespitler,
        Gozlemler,
        Uyarilar
    ]),


  ],

  providers: [
      TespitlerResolver, 
      TespitlerService  
    ],

    exports: [
      TespitlerService,
    ],

})
export class TespitlerModule {}