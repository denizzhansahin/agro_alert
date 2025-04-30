import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGozlemlerDto } from 'src/DTO/create-gozlemler.dto';
import { CihazKullanici } from 'src/Entities/cihaz_kullanici';
import { Cihazlar } from 'src/Entities/cihazlar';
import { Gozlemler } from 'src/Entities/gozlemler';
import { Repository } from 'typeorm';
// DTO yolunu kontrol edin (Dosya adı create-gozlem.dto.ts ise)

@Injectable()
export class GozlemlerService {
  constructor(
    @InjectRepository(Gozlemler)
    private readonly gozlemlerRepository: Repository<Gozlemler>,

    // Cihazlar Repository'sini enjekte et (cihazId'den CihazKullanici'ya ulaşmak için)
    @InjectRepository(Cihazlar)
    private readonly cihazlarRepository: Repository<Cihazlar>,

    // CihazKullanici hala lazım olabilir (örn: findAllByCihazKullanici için)
    // Eğer sadece create yapılıyorsa ve başka metod yoksa buna gerek kalmayabilir.
    @InjectRepository(CihazKullanici)
    private readonly cihazKullaniciRepository: Repository<CihazKullanici>,
  ) {}

  /**
   * Yeni bir gözlem kaydı oluşturur. Gözlem, belirtilen cihaza atanmış
   * olan CihazKullanici kaydıyla ilişkilendirilir.
   * @param createGozlemDto - Gözlem oluşturmak için cihaz ID'si ve diğer verileri içeren DTO.
   * @returns Oluşturulan Gozlemler nesnesi.
   */
  async create(createGozlemDto: CreateGozlemlerDto): Promise<Gozlemler> {
    // 1. DTO'dan Cihaz ID'sini ve diğer gözlem verilerini al
    const { cihazId, ...gozlemData } = createGozlemDto;

    // 2. İlgili Cihaz kaydını ve ilişkili CihazKullanici'yi veritabanında bul
    //    CihazKullanici ilişkisini yüklemek ('eager loading' yerine 'relations' ile) önemli.
    const cihaz = await this.cihazlarRepository.findOne({
        where: { id: cihazId },
        relations: ['cihaz_kullanici','cihaz_kullanici.kullanici'], // CihazKullanici ilişkisini mutlaka yükle
    });

    // 3. Eğer Cihaz bulunamazsa hata fırlat
    if (!cihaz) {
      throw new NotFoundException(`ID'si ${cihazId} olan cihaz bulunamadı.`);
    }

    // 4. Cihazın bir CihazKullanici'ya atanıp atanmadığını kontrol et
    //    Eğer cihaz bir kullanıcıya atanmamışsa, gözlem kaydedilemez.
    if (!cihaz.cihaz_kullanici) {
        throw new BadRequestException(`ID'si ${cihazId} olan cihaz herhangi bir kullanıcıya atanmamış. Gözlem kaydedilemez.`);
        // Alternatif olarak NotFoundException da kullanılabilir:
        // throw new NotFoundException(`ID'si ${cihazId} olan cihaza atanmış bir CihazKullanici kaydı bulunamadı.`);
    }

    // 5. Cihazdan alınan CihazKullanici nesnesini kullan
    const cihazKullanici = cihaz.cihaz_kullanici;

    // 6. Yeni bir Gozlemler nesnesi oluştur
    const yeniGozlem = this.gozlemlerRepository.create({
      ...gozlemData,          // DTO'dan gelen gözlem verileri (gozlem_tipi, sayisal_deger vb.)
      cihaz_kullanici: cihazKullanici, // Cihazdan alınan CihazKullanici nesnesini ilişkilendir
      tespitler: [],          // Yeni gözlemin başlangıçta tespiti olmaz
    });

    // 7. Oluşturulan gözlemi veritabanına kaydet
    try {
      return await this.gozlemlerRepository.save(yeniGozlem);
    } catch (error) {
      console.error("Gözlem oluşturulurken veritabanı hatası:", error);
      throw new InternalServerErrorException('Gözlem oluşturulamadı.');
    }
  }

  // --- Diğer Metotlar (Öncekiyle aynı kalabilir veya ihtiyaca göre güncellenebilir) ---

   /**
    * Belirli bir CihazKullanici'ya ait tüm gözlemleri getiren metod
    */
   async findAllByCihazKullanici(cihazKullaniciId: number): Promise<Gozlemler[]> {
       const cihazKullanici = await this.cihazKullaniciRepository.findOneBy({ id: cihazKullaniciId });
       if (!cihazKullanici) {
           throw new NotFoundException(`ID'si ${cihazKullaniciId} olan CihazKullanici bulunamadı.`);
       }

       return this.gozlemlerRepository.find({
           where: { cihaz_kullanici: { id: cihazKullaniciId } },
           relations: ['cihaz_kullanici', 'tespitler', 'cihaz_kullanici.kullanici'],
           order: { created_at: 'DESC' }
       });
   }

   /**
    * Belirli bir ID'ye sahip gözlemi getiren metod
    */
   async findOneById(id: number): Promise<Gozlemler> {
       const gozlem = await this.gozlemlerRepository.findOne({
           where: { id },
           relations: ['cihaz_kullanici', 'tespitler', 'cihaz_kullanici.kullanici']
       });
       if (!gozlem) {
           throw new NotFoundException(`ID'si ${id} olan Gözlem bulunamadı.`);
       }
       return gozlem;
   }

   async findAll(): Promise<Gozlemler[]> {
    // İlişkileri yüklemek isteyip istemediğinize karar verin
    return this.gozlemlerRepository.find({
         relations: ['cihaz_kullanici', 'cihaz_kullanici.kullanici','tespitler'], // Örnek: İlişkili kullanıcıyı da yükle
         order: { created_at: 'DESC' } // Örnek sıralama
    });
}
}