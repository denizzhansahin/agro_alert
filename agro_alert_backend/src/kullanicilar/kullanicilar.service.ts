import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KullaniciCreateDTO } from 'src/DTO/kullanici-create.dto';
import { KullaniciUpdateDTO } from 'src/DTO/kullanici-update.dto';
import { Kullanici } from 'src/Entities/kullanici';

import { Repository } from 'typeorm';

@Injectable()
export class KullaniciService {
    constructor(
        @InjectRepository(Kullanici) private kullaniciRepository: Repository<Kullanici>,
    ) { }

    // Yeni kullanıcı oluştur
    async kullaniciOlustur(kullaniciData: KullaniciCreateDTO) {
        const newUser = this.kullaniciRepository.create(kullaniciData);
        return await this.kullaniciRepository.save(newUser); 
    }

    // Tüm kullanıcıları getir
    async findAll(): Promise<Kullanici[]> {
        return this.kullaniciRepository.find({relations: ['cihaz_kullanici','cihaz_kullanici.cihazlar','cihaz_kullanici.gozlemler','cihaz_kullanici.gozlemler.tespitler','cihaz_kullanici.gozlemler.tespitler.uyari'
        ]});
    }

    async kullaniciBul(id: number): Promise<Kullanici> {
        const kullanici = await this.kullaniciRepository.findOne({
            where: { id },
            relations: ['cihaz_kullanici'
            ]
        });
        if (!kullanici) {
            throw new Error('Kullanıcı yok');
        }
        return kullanici;
    }

    async findByEmail(eposta:string){
        return await this.kullaniciRepository.findOne({
          where:{
            eposta:eposta,
          }
        })
      }


    async kullaniciGuncelle(kullaniciId: number, kullaniciGuncelleData: KullaniciUpdateDTO) {
        const kullanici = await this.kullaniciRepository.findOneBy({ id: kullaniciId });
        if (!kullanici) {
            throw new HttpException('Kullanici Yok', HttpStatus.NOT_FOUND);
        }

        Object.assign(kullanici, kullaniciGuncelleData);

        return await this.kullaniciRepository.save(kullanici);
    }
}