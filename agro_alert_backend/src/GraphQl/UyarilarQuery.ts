import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards, NotFoundException, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';     // Yolu doğrulayın
import { RolesGuard } from '../auth/guards/roles.guard';       // Yolu doğrulayın
import { Roles } from '../auth/decorators/roles.decorator';     // Yolu doğrulayın
import { Role } from '../auth/enums/role.enum';           // Yolu doğrulayın
import { Uyarilar } from 'src/Entities/uyarilar';
import { UyarilarService } from 'src/uyarilar/uyarilar.service';
import { CreateUyarilarDto } from 'src/DTO/create-uyarilar.dto';


@Resolver(() => Uyarilar)
@UseGuards(JwtAuthGuard, RolesGuard) // Tüm resolver için guardları uygula
export class UyarilarResolver {
    constructor(private readonly uyarilarService: UyarilarService) {}

    // --- Queries ---

    /**
     * Belirtilen ID'ye sahip uyarıyı getirir.
     * Admin tümünü, User sadece kendiyle ilişkili olanları görebilir.
     */
    @Roles(Role.ADMIN, )
    @Query(() => Uyarilar, { name: 'uyariById', nullable: true })
    async findUyariById(
        @Args('id', { type: () => Int }) id: number,
        @Context() ctx: any,
    ): Promise<Uyarilar | null> {
        try {
            const uyari = await this.uyarilarService.findOneById(id);
            // Yetkilendirme: Admin değilse, uyarı kendiyle mi ilişkili kontrol et
            const currentUser = ctx.req.user; // Guard'dan gelen kullanıcı bilgisi
            if (currentUser.role !== Role.ADMIN) {
                const uyariSahibiId = uyari.tespit?.gozlem?.cihaz_kullanici?.kullanici?.id;
           if (!uyariSahibiId || uyariSahibiId !== currentUser.sub) { // Genellikle JWT'de kullanıcı ID 'sub' içinde olur
                    throw new ForbiddenException("Bu uyarıyı görme yetkiniz yok.");
                }
            }
            return uyari;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ForbiddenException) {
                 
                 throw error;
            }
            throw error; // Diğer hataları fırlat
        }
    }


    @Roles(Role.ADMIN)
    @Query(() => [Uyarilar], { name: 'uyarilarByKullaniciId' })
    async findUyarilarByKullaniciId(
        @Args('kullaniciId', { type: () => Int }) kullaniciId: number,
        @Context() ctx: any,
    ): Promise<Uyarilar[]> {
        const currentUser = ctx.req.user;
        // Yetkilendirme: Admin değilse, sadece kendi ID'sini sorgulayabilir
        if (currentUser.role !== Role.ADMIN && currentUser.sub !== kullaniciId) {
            throw new ForbiddenException("Başka bir kullanıcının uyarılarını sorgulayamazsınız.");
        }
        return this.uyarilarService.findAllByKullanici(kullaniciId);
    }

    /**
     * Belirtilen Tespit ID'sine ait uyarıyı getirir (varsa).
     * Admin tümünü, User sadece kendiyle ilişkili olanları görebilir.
     */
    @Roles(Role.ADMIN)
    @Query(() => Uyarilar, { name: 'uyariByTespitId', nullable: true })
    async findUyariByTespitId(
        @Args('tespitId', { type: () => Int }) tespitId: number,
        @Context() ctx: any,
    ): Promise<Uyarilar | null> {
        try {
            const uyari = await this.uyarilarService.findOneByTespitId(tespitId);
            if (!uyari) return null; // Uyarı yoksa null dön

            // Yetkilendirme: Admin değilse, uyarı kendiyle mi ilişkili kontrol et
            const currentUser = ctx.req.user;
            if (currentUser.role !== Role.ADMIN) {
                 // Uyarıyı bulmak için tekrar findOneById çağırmak yerine, findOneByTespitId içinde gerekli ilişkileri yükleyip kontrol edebiliriz.
                 // Veya findOneById çağırıp onun yetkilendirmesine güvenebiliriz.
                 // Şimdilik basitlik adına, uyarı bulunduktan sonra tekrar kontrol edelim:
                 const fullUyari = await this.uyarilarService.findOneById(uyari.id); // İlişkileri yüklemek için
                 const uyariSahibiId = fullUyari.tespit?.gozlem?.cihaz_kullanici?.kullanici?.id;
                 if (!uyariSahibiId || uyariSahibiId !== currentUser.sub) {
                     throw new ForbiddenException("Bu tespite ait uyarıyı görme yetkiniz yok.");
                 }
            }
            return uyari;

        } catch (error) {
             if (error instanceof NotFoundException || error instanceof ForbiddenException) {
                 throw error;
             }
             throw error; // Diğer hataları fırlat
        }
    }


    // --- Mutations ---

    /**
     * Yeni bir uyarı oluşturur.
     * Admin veya ilgili Kullanici oluşturabilir.
     */
    @Roles(Role.ADMIN)
    @Mutation(() => Uyarilar, { name: 'createUyari' })
    async createUyari(
        @Args('createUyariData', { type: () => CreateUyarilarDto }) createUyariData: CreateUyarilarDto,
        @Context() ctx: any,
    ): Promise<Uyarilar> {
        const currentUser = ctx.req.user;
        // Servise isteği yapan kullanıcının ID'sini göndererek orada yetki kontrolü yapılmasını sağla
        return this.uyarilarService.create(createUyariData, currentUser.sub);
    }
}