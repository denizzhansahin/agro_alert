import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTespitlerDto } from 'src/DTO/create-tespitler.dto';
import { Gozlemler } from 'src/Entities/gozlemler';
import { Tespitler } from 'src/Entities/tespitler';
import { Repository } from 'typeorm';


@Injectable()
export class TespitlerService {
  constructor(
    @InjectRepository(Tespitler)
    private readonly tespitlerRepository: Repository<Tespitler>,

    @InjectRepository(Gozlemler)
    private readonly gozlemlerRepository: Repository<Gozlemler>,
  ) {}

  /**
   * Belirtilen gözleme ait yeni bir tespit kaydı oluşturur.
   * @param createTespitlerDto - Tespit oluşturmak için gerekli verileri (gozlemId dahil) içeren DTO.
   * @returns Oluşturulan Tespitler nesnesi.
   */
  async create(createTespitlerDto: CreateTespitlerDto): Promise<Tespitler> {
    // 1. DTO'dan Gozlem ID'sini ve diğer tespit verilerini al
    const { gozlemId, ...tespitData } = createTespitlerDto;

    // 2. İlgili Gozlem kaydını veritabanında bul
    const gozlem = await this.gozlemlerRepository.findOneBy({ id: gozlemId });

    // 3. Eğer Gozlem bulunamazsa hata fırlat
    if (!gozlem) {
      throw new NotFoundException(`ID'si ${gozlemId} olan Gözlem bulunamadı.`);
    }

    // 4. Yeni bir Tespitler nesnesi oluştur
    const yeniTespit = this.tespitlerRepository.create({
      ...tespitData, // DTO'dan gelen tespit verileri (tespit_tipi, guven_skoru vb.)
      gozlem: gozlem, // Bulunan Gozlem nesnesini ilişkilendir
      uyari: null,    // Uyari bu metodla oluşturulmuyor/bağlanmıyor
    });

    // 5. Oluşturulan tespiti veritabanına kaydet
    try {
      return await this.tespitlerRepository.save(yeniTespit);
    } catch (error) {
      console.error("Tespit oluşturulurken veritabanı hatası:", error);
      throw new InternalServerErrorException('Tespit oluşturulamadı.');
    }
  }

  // --- Opsiyonel Okuma Metotları ---

  /**
   * Belirli bir Gozlem'e ait tüm tespitleri getirir.
   * @param gozlemId - Tespitleri getirilecek Gozlem'in ID'si.
   * @returns Bulunan Tespitler nesnelerinin listesi.
   */
  async findAllByGozlem(gozlemId: number): Promise<Tespitler[]> {
    const gozlemExists = await this.gozlemlerRepository.existsBy({ id: gozlemId });
    if (!gozlemExists) {
        throw new NotFoundException(`ID'si ${gozlemId} olan Gözlem bulunamadı.`);
    }

    return this.tespitlerRepository.find({
      where: { gozlem: { id: gozlemId } },
      relations: ['gozlem', 'uyari'],
      order: { created_at: 'ASC' },
    });
  }

  /**
   * Belirli bir ID'ye sahip tespiti getirir.
   * @param id - Getirilecek Tespit'in ID'si.
   * @returns Bulunan Tespit nesnesi.
   */
  async findOneById(id: number): Promise<Tespitler> {
    const tespit = await this.tespitlerRepository.findOne({
      where: { id },
      relations: ['gozlem', 'uyari'],
    });
    if (!tespit) {
      throw new NotFoundException(`ID'si ${id} olan Tespit bulunamadı.`);
    }
    return tespit;
  }
}