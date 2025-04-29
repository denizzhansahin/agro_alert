import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { UseGuards, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';     // Auth yolunu kontrol edin
import { RolesGuard } from '../auth/guards/roles.guard';       // Auth yolunu kontrol edin
import { Roles } from '../auth/decorators/roles.decorator';     // Auth yolunu kontrol edin
import { Role } from '../auth/enums/role.enum';           // Auth yolunu kontrol edin
import { CihazKullanici } from 'src/Entities/cihaz_kullanici';
import { CihazKullaniciService } from 'src/cihaz_kullanici/cihaz_kullanici.service';
// Kullanılmayan DTO importları kaldırıldı

@Resolver(() => CihazKullanici)
@UseGuards(JwtAuthGuard, RolesGuard) // Guard'ları sınıf seviyesinde uygulayarak tekrarı azaltın
export class CihazKullaniciResolver {
    constructor(private readonly cihazKullaniciService: CihazKullaniciService) {}

    // --- Queries ---

    @Roles(Role.ADMIN) // Sadece Admin erişebilir
    @Query(() => [CihazKullanici], { name: 'allCihazKullanicilar' }) // GraphQL şemasında açık isim kullanmak iyidir
    async findAllCihazKullanicilar(): Promise<CihazKullanici[]> {

        return this.cihazKullaniciService.findAll(['kullanici','cihazlar']); // Örnek: Sadece kullanıcı bilgisini yükle
    }

    @Roles(Role.ADMIN) // Sadece Admin erişebilir (veya belki User kendi kaydını görebilir - ek mantık gerekir)
    @Query(() => CihazKullanici, { name: 'cihazKullaniciById' })
    async findCihazKullaniciById(
        @Args('id', { type: () => Int }) id: number
    ): Promise<CihazKullanici> {
        // Tek kayıt getirirken ilişkileri yüklemek daha yaygındır
        return this.cihazKullaniciService.findOneById(id);
    }

    // Kullanıcı ID'sine göre CihazKullanici bulma sorgusu eklendi
    @Roles(Role.ADMIN) // Admin veya User (kendi kaydı için?) erişebilir
    @Query(() => CihazKullanici, { name: 'cihazKullaniciByKullaniciId', nullable: true })
    async findCihazKullaniciByKullaniciId(
        @Args('kullaniciId', { type: () => Int }) kullaniciId: number

    ): Promise<CihazKullanici | null> {
        try {
            // Kullanıcı ve cihaz bilgileri genellikle istenir
            return await this.cihazKullaniciService.findOneByKullaniciId(kullaniciId, ['kullanici', 'cihazlar']);
        } catch (error) {
            // Servis NotFoundException fırlattığında GraphQL null dönsün
            if (error instanceof NotFoundException) {
                return null;
            }
            throw error; // Diğer hataları tekrar fırlat
        }
    }

    // --- Mutations ---

    // DTO yerine kullaniciId alacak şekilde düzeltildi, servis metodu düzeltildi
    @Roles(Role.ADMIN)
    @Mutation(() => CihazKullanici, { name: 'createCihazKullaniciForUser' })
    async createCihazKullanici(
        @Args('kullaniciId', { type: () => Int }) kullaniciId: number,
    ): Promise<CihazKullanici> {
        return this.cihazKullaniciService.createForKullanici(kullaniciId);
    }

    // Cihaz atama mutasyonu eklendi
    @Roles(Role.ADMIN)
    @Mutation(() => CihazKullanici, { name: 'assignCihazToKullanici' })
    async assignCihaz(
        @Args('kullaniciId', { type: () => Int }) kullaniciId: number,
        @Args('cihazId', { type: () => Int }) cihazId: number,
    ): Promise<CihazKullanici> {
        // Servis metodu güncellenmiş CihazKullanici'yi döndürüyordu
        return this.cihazKullaniciService.assignCihazToKullanici(kullaniciId, cihazId);
    }


    @Roles(Role.ADMIN)
    @Mutation(() => Boolean, { name: 'removeCihazFromKullanici' })
    async removeCihaz(
        @Args('kullaniciId', { type: () => Int }) kullaniciId: number,
        @Args('cihazId', { type: () => Int }) cihazId: number,
    ): Promise<boolean> {
        // Servis metodu boolean döndürüyordu
        return this.cihazKullaniciService.removeCihazFromKullanici(kullaniciId, cihazId);
    }



}