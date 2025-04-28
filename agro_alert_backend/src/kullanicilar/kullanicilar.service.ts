import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Kullanici } from '../Entities/kullanici';
import { KullaniciCreateDTO } from 'src/DTO/kullanici-create.dto';
import { KullaniciUpdateDTO } from 'src/DTO/kullanici-update.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class KullanicilarService {
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
    return this.kullaniciRepository.find();
}

async kullaniciBul(id: number): Promise<Kullanici> {
    const kullanici = await this.kullaniciRepository.findOne({
        where: { id },
        relations: ['cihaz_kullanici']
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
