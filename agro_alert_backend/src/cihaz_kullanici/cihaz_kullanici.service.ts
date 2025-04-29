import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CihazKullanici } from 'src/Entities/cihaz_kullanici';
import { Cihazlar } from 'src/Entities/cihazlar';
import { Kullanici } from 'src/Entities/kullanici';
import { Repository, FindOptionsWhere } from 'typeorm';


@Injectable()
export class CihazKullaniciService {
  constructor(
    @InjectRepository(CihazKullanici)
    private readonly cihazKullaniciRepository: Repository<CihazKullanici>,
    @InjectRepository(Kullanici)
    private readonly kullaniciRepository: Repository<Kullanici>,
    @InjectRepository(Cihazlar)
    private readonly cihazlarRepository: Repository<Cihazlar>,
  ) {}


  async createForKullanici(kullaniciId: number): Promise<CihazKullanici> {
    // 1. Kullanıcıyı bul
    const kullanici = await this.kullaniciRepository.findOneBy({ id: kullaniciId });
    if (!kullanici) {
      throw new NotFoundException(`ID'si ${kullaniciId} olan kullanıcı bulunamadı.`);
    }

    // 2. Kullanıcının zaten CihazKullanici kaydı var mı kontrol et
    const existing = await this.cihazKullaniciRepository.findOneBy({ kullanici: { id: kullaniciId } });
    if (existing) {
      throw new BadRequestException(`ID'si ${kullaniciId} olan kullanıcı zaten bir CihazKullanici kaydına sahip.`);
    }

    // 3. Yeni CihazKullanici oluştur ve ilişkilendir
    const yeniCihazKullanici = this.cihazKullaniciRepository.create({
      kullanici: kullanici,
      cihazlar: [], // Başlangıçta cihaz listesi boş
      gozlemler: [], // Başlangıçta gözlem listesi boş
    });

    // 4. Kaydet ve döndür
    try {
      return await this.cihazKullaniciRepository.save(yeniCihazKullanici);
    } catch (error) {
      // Veritabanı hatalarını yakala (örn: unique constraint ihlali gibi beklenmedik durumlar)
      console.error("CihazKullanici oluşturulurken hata:", error);
      throw new InternalServerErrorException('CihazKullanici kaydı oluşturulamadı.');
    }
  }


  async assignCihazToKullanici(kullaniciId: number, cihazId: number): Promise<CihazKullanici> {
    // 1. CihazKullanici kaydını bul (yoksa oluşturulabilir veya hata verilebilir - burada hata veriyoruz)
    let cihazKullanici = await this.findOneByKullaniciId(kullaniciId); // İlişkileri yüklemeye gerek yok


    const cihaz = await this.cihazlarRepository.findOne({
        where: { id: cihazId },
        relations: ['cihaz_kullanici'] // Cihazın mevcut sahibini kontrol etmek için yükle
    });
    if (!cihaz) {
      throw new NotFoundException(`ID'si ${cihazId} olan cihaz bulunamadı.`);
    }

    // 3. Cihaz zaten başka bir kullanıcıya atanmış mı kontrol et
    if (cihaz.cihaz_kullanici && cihaz.cihaz_kullanici.id !== cihazKullanici.id) {
        const mevcutSahip = await this.kullaniciRepository.findOneBy({ cihaz_kullanici: { id: cihaz.cihaz_kullanici.id } });
        const mevcutSahipBilgisi = mevcutSahip ? `(Kullanıcı ID: ${mevcutSahip.id})` : `(ID: ${cihaz.cihaz_kullanici.id})`;
        throw new BadRequestException(`ID'si ${cihazId} olan cihaz zaten başka bir CihazKullanici'ya ${mevcutSahipBilgisi} atanmış.`);
    }


    // 5. Cihazı CihazKullanici'ya ata (ManyToOne tarafını güncellemek yeterli)
    cihaz.cihaz_kullanici = cihazKullanici;

    // 6. Cihazı kaydet (ilişki güncellenir)
    try {
      await this.cihazlarRepository.save(cihaz);
    } catch (error) {
      console.error(`Cihaz ${cihazId} Kullanıcı ${kullaniciId}'e atanırken hata:`, error);
      throw new InternalServerErrorException('Cihaz atama işlemi başarısız oldu.');
    }

    // 7. Güncellenmiş CihazKullanici'yi ilişkileriyle birlikte döndür
    return this.findOneById(cihazKullanici.id);
  }


  async removeCihazFromKullanici(kullaniciId: number, cihazId: number): Promise<boolean> {
     // 1. CihazKullanici kaydını bul
     const cihazKullanici = await this.findOneByKullaniciId(kullaniciId); // İlişkiye gerek yok

     // 2. Cihazı bul ve mevcut sahibini kontrol et
     const cihaz = await this.cihazlarRepository.findOne({
       where: { id: cihazId },
       relations: ['cihaz_kullanici'],
     });

     if (!cihaz) {
       throw new NotFoundException(`ID'si ${cihazId} olan cihaz bulunamadı.`);
     }

     // 3. Cihaz bu kullanıcıya mı ait kontrol et
     if (!cihaz.cihaz_kullanici || cihaz.cihaz_kullanici.id !== cihazKullanici.id) {
       throw new BadRequestException(`ID'si ${cihazId} olan cihaz, ID'si ${kullaniciId} olan kullanıcıya ait değil.`);
     }

     // 4. Cihazın ilişkisini kaldır (cihaz_kullanici'yi null yap)
     cihaz.cihaz_kullanici = null;

     // 5. Cihazı kaydet
     try {
       await this.cihazlarRepository.save(cihaz);
       return true;
     } catch (error) {
       console.error(`Cihaz ${cihazId} Kullanıcı ${kullaniciId}'den kaldırılırken hata:`, error);
       throw new InternalServerErrorException('Cihaz kaldırma işlemi başarısız oldu.');
     }
  }


  async findAll(relations: string[] = []): Promise<CihazKullanici[]> {
    return this.cihazKullaniciRepository.find({ relations });
  }


  async findOneById(id: number): Promise<CihazKullanici> {
    const cihazKullanici = await this.cihazKullaniciRepository.findOne({ where: { id }, relations:['kullanici', 'cihazlar', 'gozlemler'] });
    if (!cihazKullanici) {
      throw new NotFoundException(`ID'si ${id} olan CihazKullanici bulunamadı.`);
    }
    return cihazKullanici;
  }


  async findOneByKullaniciId(kullaniciId: number, relations: string[] = ['kullanici', 'cihazlar']): Promise<CihazKullanici> {
    // Doğrudan kullanici ilişkisi üzerinden sorgu yap
    const cihazKullanici = await this.cihazKullaniciRepository.findOne({
        where: { kullanici: { id: kullaniciId } },
        relations: relations
    });

    if (!cihazKullanici) {
      // Kullanıcı var mı diye kontrol edip daha anlamlı bir hata verebiliriz
      const kullaniciExists = await this.kullaniciRepository.existsBy({ id: kullaniciId });
      if (!kullaniciExists) {
        throw new NotFoundException(`ID'si ${kullaniciId} olan kullanıcı bulunamadı.`);
      } else {
        throw new NotFoundException(`ID'si ${kullaniciId} olan kullanıcı için CihazKullanici kaydı bulunamadı.`);
      }
    }
    return cihazKullanici;
  }





  async isCihazAssignedToKullanici(kullaniciId: number, cihazId: number): Promise<boolean> {
    try {
        const cihaz = await this.cihazlarRepository.findOneOrFail({
            where: {
                id: cihazId,
                cihaz_kullanici: { kullanici: { id: kullaniciId } } // İç içe ilişki sorgusu
            },
            select: ['id'] // Sadece ID'yi seçmek yeterli
        });
        return !!cihaz; // Cihaz bulunduysa true döner
    } catch (error) {

        if (error.name === 'EntityNotFound') {
             return false;
        }
        throw error; // Beklenmedik diğer hataları tekrar fırlat
    }
  }
}