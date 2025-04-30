import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UyarilarService } from './uyarilar.service';
import { Uyarilar } from 'src/Entities/uyarilar';
import { Kullanici } from 'src/Entities/kullanici';
import { Tespitler } from 'src/Entities/tespitler';
import { UyarilarResolver } from 'src/GraphQl/UyarilarQuery';

// Gerekirse AuthModule veya diğer bağımlılıkları import edin

@Module({
  imports: [
    TypeOrmModule.forFeature([
        Uyarilar,
        Kullanici, // Service kullandığı için
        Tespitler  // Service kullandığı için
    ]),
    // AuthModule, // Gerekliyse
  ],
  providers: [UyarilarResolver, UyarilarService],
  exports: [UyarilarService], // Başka modüllerde kullanılacaksa export edin
})
export class UyarilarModule {}