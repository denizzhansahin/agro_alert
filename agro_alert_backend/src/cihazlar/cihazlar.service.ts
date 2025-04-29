import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cihazlar } from '../Entities/cihazlar';
import { CreateCihazDto } from '../DTO/create-cihaz.dto';
import { UpdateCihazDto } from '../DTO/update-cihaz.dto';

@Injectable()
export class CihazlarService {
  constructor(
    @InjectRepository(Cihazlar)
    private readonly cihazlarRepository: Repository<Cihazlar>,
  ) {}

  async createCihaz(createCihazDto: CreateCihazDto): Promise<Cihazlar> {
    const cihaz = this.cihazlarRepository.create(createCihazDto);
    return this.cihazlarRepository.save(cihaz);
  }

  async updateCihaz(id: number, updateCihazDto: UpdateCihazDto): Promise<Cihazlar> {
    await this.cihazlarRepository.update(id, updateCihazDto);
    return this.cihazlarRepository.findOneOrFail({ where: { id } });
  }

  async getCihazById(id: number): Promise<Cihazlar> {
    const cihaz = await this.cihazlarRepository.findOne({relations:['cihaz_kullanici','cihaz_kullanici.kullanici','cihaz_kullanici.gozlemler',
      'cihaz_kullanici.gozlemler.tespitler', 'cihaz_kullanici.gozlemler.tespitler.uyari'],where:{id}});
    if (!cihaz) {
      throw new Error(`Cihaz with ID ${id} not found`);
    }
    return cihaz;
  }

  async getAllCihazlar(): Promise<Cihazlar[]> {
    return await this.cihazlarRepository.find({relations:['cihaz_kullanici','cihaz_kullanici.kullanici','cihaz_kullanici.gozlemler',
      'cihaz_kullanici.gozlemler.tespitler', 'cihaz_kullanici.gozlemler.tespitler.uyari']});
  }
}
