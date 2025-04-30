import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUyarilarDto } from 'src/DTO/create-uyarilar.dto';
import { Kullanici } from 'src/Entities/kullanici';
import { Tespitler } from 'src/Entities/tespitler';
import { Uyarilar } from 'src/Entities/uyarilar';
import { Repository } from 'typeorm';


@Injectable()
export class UyarilarService {
  constructor(
    @InjectRepository(Uyarilar)
    private readonly uyarilarRepository: Repository<Uyarilar>,

    @InjectRepository(Kullanici)
    private readonly kullaniciRepository: Repository<Kullanici>,

    @InjectRepository(Tespitler)
    private readonly tespitlerRepository: Repository<Tespitler>,
  ) {}

  /**
   * Yeni bir uyarı kaydı oluşturur.
   * Uyarı mantıksal olarak bir kullanıcıya aittir ve opsiyonel olarak bir tespite bağlanır.
   * @param createUyarilarDto - Uyarı oluşturma verileri.
   * @param creatingUserId - (Opsiyonel ama önerilir) İsteği yapan kullanıcının ID'si (yetkilendirme için).
   * @returns Oluşturulan Uyarilar nesnesi.
   */
  async create(createUyarilarDto: CreateUyarilarDto, creatingUserId?: number): Promise<Uyarilar> {
    const { kullaniciId, tespitId, gozlemId, ...uyariData } = createUyarilarDto;

    // 1. Belirtilen Kullanıcı var mı? (DTO'daki zorunlu alan)
    const kullanici = await this.kullaniciRepository.findOneBy({ id: kullaniciId });
    if (!kullanici) {
      throw new NotFoundException(`ID'si ${kullaniciId} olan Kullanıcı bulunamadı.`);
    }

    // Yetkilendirme Kontrolü (Örnek): Eğer isteği yapan kullanıcı ID'si belliyse,
    // kullanıcının kendi adına mı yoksa başkası adına mı uyarı oluşturduğunu kontrol et.
    // Genellikle kullanıcı sadece kendi adına işlem yapabilmeli (Admin değilse).
    if (creatingUserId && creatingUserId !== kullaniciId /* && currentUserRole !== Role.ADMIN */) {
        throw new BadRequestException(`Başkası adına uyarı oluşturamazsınız.`);
    }

    let ilgiliTespit: Tespitler | null = null;

    // 2. Eğer tespitId verildiyse, tespiti bul ve doğrula
    if (tespitId) {
      ilgiliTespit = await this.tespitlerRepository.findOne({
          where: { id: tespitId },
          // Kullanıcı doğrulama için ilişkileri yükle: Tespit -> Gozlem -> CihazKullanici -> Kullanici
          relations: [
              'gozlem',
              'gozlem.cihaz_kullanici',
              'gozlem.cihaz_kullanici.kullanici'
            ],
      });

      if (!ilgiliTespit) {
        throw new NotFoundException(`ID'si ${tespitId} olan Tespit bulunamadı.`);
      }

      // Doğrulama: Bulunan tespit, DTO'da belirtilen kullanıcıya mı ait?
      const tespitSahibiId = ilgiliTespit.gozlem?.cihaz_kullanici?.kullanici?.id;
      if (!tespitSahibiId || tespitSahibiId !== kullaniciId) {
          throw new BadRequestException(`Tespit (ID: ${tespitId}), Kullanıcı (ID: ${kullaniciId}) ile ilişkili değil.`);
      }

      // İsteğe bağlı: gozlemId de verildiyse, tespitin o gözleme ait olup olmadığını kontrol et
      if (gozlemId && ilgiliTespit.gozlem?.id !== gozlemId) {
          throw new BadRequestException(`Tespit (ID: ${tespitId}), belirtilen Gözlem (ID: ${gozlemId}) ile ilişkili değil.`);
      }

    }
    // Not: Sadece gozlemId verilirse ve tespitId verilmezse, şu anki entity yapısıyla doğrudan bir bağlantı kurulamıyor.
    // Bu senaryo için ek bir mantık veya entity değişikliği gerekir. Şimdilik yok sayıyoruz.

    // 3. Yeni Uyarı nesnesini oluştur
    const yeniUyari = this.uyarilarRepository.create({
      ...uyariData,   // uyari_seviyesi, mesaj, durum vb.
      tespit: ilgiliTespit, // Bulunan tespit veya null
    });

    // 4. Veritabanına kaydet
    try {
      return await this.uyarilarRepository.save(yeniUyari);
    } catch (error) {
      // Özellikle OneToOne ilişkisinde UNIQUE constraint hatası olabilir mi kontrol et
      if (error.code === 'SQLITE_CONSTRAINT' || (error.driverError && error.driverError.code === 'SQLITE_CONSTRAINT' && error.message.includes('UNIQUE constraint failed: uyarilar.tespitId'))) {
         throw new BadRequestException(`ID'si ${tespitId} olan tespit için zaten bir uyarı mevcut.`);
      }
      console.error("Uyarı oluşturulurken veritabanı hatası:", error);
      throw new InternalServerErrorException('Uyarı oluşturulamadı.');
    }
  }

  // --- Okuma Metotları (Örnekler) ---

  /**
   * Belirli bir ID'ye sahip uyarıyı getirir.
   */
  async findOneById(id: number): Promise<Uyarilar> {
    const uyari = await this.uyarilarRepository.findOne({
        where: { id },
        relations: ['tespit', 'tespit.gozlem', 'tespit.gozlem.cihaz_kullanici', 'tespit.gozlem.cihaz_kullanici.kullanici'], // Gerekli ilişkileri yükle
    });
    if (!uyari) {
      throw new NotFoundException(`ID'si ${id} olan Uyarı bulunamadı.`);
    }
    return uyari;
  }

  /**
   * Mantıksal olarak belirli bir kullanıcıya ait uyarıları getirir (tespitleri üzerinden).
   */
  async findAllByKullanici(kullaniciId: number): Promise<Uyarilar[]> {
     // Kullanıcının varlığını kontrol et
     const kullaniciExists = await this.kullaniciRepository.existsBy({ id: kullaniciId });
     if (!kullaniciExists) {
         throw new NotFoundException(`ID'si ${kullaniciId} olan Kullanıcı bulunamadı.`);
     }

     // Bu sorgu biraz karmaşık olabilir:
     // Uyariları getir, ama sadece 'tespit' ilişkisi üzerinden gidildiğinde
     // 'kullaniciId' eşleşenleri al.
     // TypeORM QueryBuilder kullanmak daha esnek olabilir.
     return this.uyarilarRepository.createQueryBuilder("uyari")
        .leftJoinAndSelect("uyari.tespit", "tespit")
        .leftJoin("tespit.gozlem", "gozlem")
        .leftJoin("gozlem.cihaz_kullanici", "cihazKullanici")
        .leftJoin("cihazKullanici.kullanici", "kullanici")
        .where("kullanici.id = :kullaniciId", { kullaniciId })
        // .orWhere(...) // Belki doğrudan kullanıcıya bağlı uyarılar varsa (entity değişirse)
        .orderBy("uyari.created_at", "DESC")
        .getMany();

  }

    /**
     * Belirli bir tespite ait uyarıyı getirir (varsa).
     */
    async findOneByTespitId(tespitId: number): Promise<Uyarilar | null> {
        // Tespitin varlığını kontrol et
        const tespitExists = await this.tespitlerRepository.existsBy({ id: tespitId });
        if (!tespitExists) {
            throw new NotFoundException(`ID'si ${tespitId} olan Tespit bulunamadı.`);
        }

        return this.uyarilarRepository.findOne({
            where: { tespit: { id: tespitId } },
            relations: ['tespit'], // İlişkiyi yükle
        });
    }

}