import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql'; // Context eklendi
import { UseGuards, NotFoundException, ForbiddenException } from '@nestjs/common'; // ForbiddenException eklendi
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { CihazKullanici } from 'src/Entities/cihaz_kullanici';   // Entity yolu düzeltildi
import { CihazKullaniciService } from 'src/cihaz_kullanici/cihaz_kullanici.service'; // Service yolu düzeltildi


@Resolver(() => CihazKullanici)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CihazKullaniciResolver {
    constructor(private readonly cihazKullaniciService: CihazKullaniciService) { }

    @Roles(Role.ADMIN)
    @Query(() => [CihazKullanici], { name: 'allCihazKullanicilar' })
    async findAllCihazKullanicilar(): Promise<CihazKullanici[]> {
        // Admin tüm ilişkileri görebilir
        return this.cihazKullaniciService.findAll(['kullanici', 'cihazlar']);
    }

    @Roles(Role.ADMIN, Role.CIFTCI)
    @Query(() => CihazKullanici, { name: 'cihazKullaniciById', nullable: true }) // nullable: true eklendi
    async findCihazKullaniciById(
        @Args('id', { type: () => Int }) id: number,
        @Context() ctx: any, // Context eklendi
    ): Promise<CihazKullanici | null> { // Dönüş tipi | null
        try {
            // Servis ilişkileri yüklemeli ('kullanici' dahil)
            const cihazKullanici = await this.cihazKullaniciService.findOneById(id);
            const currentUser = ctx.req.user;


            // Yetkilendirme: Çiftçi ise sadece kendi CihazKullanici kaydını görebilir
            if (currentUser.role === Role.CIFTCI && cihazKullanici.kullanici?.id !== currentUser.sub) {
                console.warn(`User ${currentUser.sub} tried to access CihazKullanici ${id} owned by ${cihazKullanici.kullanici?.id}`);
                return null; // Yetkisi yoksa null dön
                // throw new ForbiddenException("Bu Cihaz Kullanıcı kaydını görme yetkiniz yok.");
            }
            return cihazKullanici;
        } catch (error) {
            if (error instanceof NotFoundException) {
                return null;
            }
            console.error(`Error fetching CihazKullanici by id ${id}:`, error);
            throw error;
        }
    }


    @Roles(Role.ADMIN, Role.CIFTCI)
    @Query(() => CihazKullanici, { name: 'cihazKullaniciByKullaniciId', nullable: true })
    async findCihazKullaniciByKullaniciId(
        @Args('kullaniciId', { type: () => Int }) kullaniciId: number,
        @Context() ctx: any, // Context eklendi
    ): Promise<CihazKullanici | null> {
        const currentUser = ctx.req.user;
        // Yetkilendirme: Çiftçi ise sadece kendi ID'sini sorgulayabilir
        if (currentUser.role === Role.CIFTCI && currentUser.id !== kullaniciId) {
            throw new ForbiddenException('Başka bir kullanıcıyı sorgulayamazsınız.');
        }

        try {
            // Servis ilişkileri yüklemeli
            return await this.cihazKullaniciService.findOneByKullaniciId(kullaniciId, ['kullanici', 'cihazlar']);
        } catch (error) {
            if (error instanceof NotFoundException) {
                return null;
            }
            console.error(`Error fetching CihazKullanici by kullaniciId ${kullaniciId}:`, error);
            throw error; // Diğer hataları tekrar fırlat
        }
    }


    @Roles(Role.ADMIN, Role.CIFTCI) // Genellikle sadece admin yapar ama çiftçi kendi için yapabilir mi?
    @Mutation(() => CihazKullanici, { name: 'createCihazKullaniciForUser' })
    async createCihazKullanici(
        @Args('kullaniciId', { type: () => Int }) kullaniciId: number,
        @Context() ctx: any, // Context eklendi
    ): Promise<CihazKullanici> {
        const currentUser = ctx.req.user;

        // Yetkilendirme: Çiftçi ise sadece kendi kullaniciId'si için oluşturabilir
        if (currentUser.role === Role.CIFTCI && currentUser.sub !== kullaniciId) {
            throw new ForbiddenException("Başka bir kullanıcı için Cihaz Kullanıcı kaydı oluşturamazsınız.");
        }
        // Servis zaten mevcut kayıt kontrolü ve restore mantığını içeriyor.
        return this.cihazKullaniciService.createForKullanici(kullaniciId);
    }


    @Roles(Role.ADMIN, Role.CIFTCI) // Genellikle admin yapar
    @Mutation(() => CihazKullanici, { name: 'assignCihazToKullanici' })
    async assignCihaz(
        @Args('kullaniciId', { type: () => Int }) kullaniciId: number,
        @Args('cihazId', { type: () => Int }) cihazId: number,
        @Context() ctx: any, // Context eklendi
    ): Promise<CihazKullanici> {
        const currentUser = ctx.req.user;

        // Yetkilendirme: Çiftçi ise sadece kendi kullaniciId'sine cihaz atayabilir
        if (currentUser.role === Role.CIFTCI && currentUser.sub !== kullaniciId) {
            throw new ForbiddenException("Başka bir kullanıcıya cihaz atayamazsınız.");
        }
        // Ekstra kontrol: Çiftçi, kendisine ait olmayan bir cihazı atamaya çalışmamalı.
        // Bu kontrol serviste veya burada yapılabilir (CihazlarService'e ihtiyaç duyar).

        return this.cihazKullaniciService.assignCihazToKullanici(kullaniciId, cihazId);
    }


    @Roles(Role.ADMIN, Role.CIFTCI) // Genellikle admin yapar
    @Mutation(() => Boolean, { name: 'removeCihazFromKullanici' })
    async removeCihaz(
        @Args('kullaniciId', { type: () => Int }) kullaniciId: number,
        @Args('cihazId', { type: () => Int }) cihazId: number,
        @Context() ctx: any, // Context eklendi
    ): Promise<boolean> {
        const currentUser = ctx.req.user;

        // Yetkilendirme: Çiftçi ise sadece kendi kullaniciId'sinden cihaz kaldırabilir
        if (currentUser.role === Role.CIFTCI && currentUser.sub !== kullaniciId) {
            throw new ForbiddenException("Başka bir kullanıcıdan cihaz kaldıramazsınız.");
        }
        // Ekstra kontrol: Çiftçi, kendisine ait olmayan bir cihazı kaldırmaya çalışmamalı.

        return this.cihazKullaniciService.removeCihazFromKullanici(kullaniciId, cihazId);
    }
}