import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards, NotFoundException, ForbiddenException } from '@nestjs/common'; // NotFoundException eklendi
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';     // Yolu kontrol edin
import { RolesGuard } from '../auth/guards/roles.guard';       // Yolu kontrol edin
import { Roles } from '../auth/decorators/roles.decorator';     // Yolu kontrol edin
import { Role } from '../auth/enums/role.enum';           // Yolu kontrol edin
import { GozlemlerService } from 'src/gozlemler/gozlemler.service';
import { Gozlemler } from 'src/Entities/gozlemler';
import { CreateGozlemlerDto } from 'src/DTO/create-gozlemler.dto';
import { CihazKullaniciService } from 'src/cihaz_kullanici/cihaz_kullanici.service';
import { CihazlarService } from 'src/cihazlar/cihazlar.service';

@Resolver(() => Gozlemler)
@UseGuards(JwtAuthGuard, RolesGuard) // Tüm resolver için guardları uygula
export class GozlemlerResolver {
    constructor(private readonly gozlemlerService: GozlemlerService, private readonly cihazlarKullaniciService:CihazKullaniciService, private readonly cihazlarService:CihazlarService) {}

    // --- Queries ---

    /**
     * TÜM gözlemleri getirir (Performansa dikkat!).
     * Sadece Admin erişebilir.
     * GozlemlerService'te findAll() metodu gerektirir.
     */
    @Roles(Role.ADMIN)
    @Query(() => [Gozlemler], { name: 'allGozlemler' })
    async findAllGozlemler(): Promise<Gozlemler[]> {
        // return this.gozlemlerService.findAllByCihazKullanici(); // HATALI: Argüman eksik
        // Serviste şöyle bir metod olmalı:
        return this.gozlemlerService.findAll(); // Yeni eklenecek findAll metodunu çağır
    }

    /**
     * Belirtilen ID'ye sahip tek bir gözlemi getirir.
     * Bulunamazsa null döner.
     * Sadece Admin erişebilir (veya yetkilendirme ile kullanıcı kendi gözlemini görebilir).
     */
    @Roles(Role.ADMIN,Role.CIFTCI) // VEYA @Roles(Role.ADMIN, Role.USER) ve ek yetkilendirme
    @Query(() => Gozlemler, { name: 'gozlemById', nullable: true }) // nullable: true eklendi
    async findGozlemById(
        @Args('id', { type: () => Int }) id: number,
        @Context() ctx: any,
    ): Promise<Gozlemler | null> { // Dönüş tipi | null olarak güncellendi
        try {
            const currentUser = ctx.req;
            const gozlem = await this.gozlemlerService.findOneById(id);

            

            if (currentUser.user.role === Role.CIFTCI) {
                const gozlemOwnerId = gozlem.cihaz_kullanici?.kullanici?.id;
                if (!gozlemOwnerId || gozlemOwnerId !==  ctx.req.user.id) {
                    throw new ForbiddenException("Bu gözlemi görme yetkiniz yok.");
                }
            }

            return gozlem;
        } catch (error) {
            // Servisten NotFoundException gelirse null döndür
            if (error instanceof NotFoundException) {
                return null;
            }
            // Diğer hataları tekrar fırlat
            throw error;
        }
    }

    /**
     * Belirtilen CihazKullanici ID'sine ait tüm gözlemleri getirir.
     * Sadece Admin erişebilir (veya yetkilendirme ile kullanıcı kendi gözlemlerini görebilir).
     */
    @Roles(Role.ADMIN,Role.CIFTCI) // VEYA @Roles(Role.ADMIN, Role.USER) ve ek yetkilendirme
    @Query(() => [Gozlemler], { name: 'gozlemlerByCihazKullaniciId' })
    async findGozlemlerByCihazKullaniciId(
        @Args('cihazKullaniciId', { type: () => Int }) cihazKullaniciId: number,
    
    ): Promise<Gozlemler[]> {

    




        return this.gozlemlerService.findAllByCihazKullanici(cihazKullaniciId);
    }

    // --- Mutations ---

    /**
     * Yeni bir gözlem oluşturur.
     * Sadece Admin erişebilir (veya yetkilendirme ile kullanıcı kendi cihazı için oluşturabilir).
     */
    @Roles(Role.ADMIN,Role.CIFTCI) // VEYA @Roles(Role.ADMIN, Role.USER) ve ek yetkilendirme
    @Mutation(() => Gozlemler, { name: 'createGozlem' })
    async createGozlem(
        @Args('createGozlemData', { type: () => CreateGozlemlerDto }) createGozlemData: CreateGozlemlerDto, @Context() ctx: any,
    ): Promise<Gozlemler> {
        // Yetkilendirme örneği:
        // const currentUser = ctx.req.user;
        // if(currentUser.role !== Role.ADMIN && !await this.checkUserOwnsDevice(currentUser.id, createGozlemData.cihazId)) {
        //     throw new ForbiddenException('Bu cihaz için gözlem oluşturma yetkiniz yok.');
        // }
        return this.gozlemlerService.create(createGozlemData);
    }
}

// Örnek Yetkilendirme Yardımcı Metodları (Servis veya ayrı bir auth servisine taşınabilir)
// async checkUserOwnsDevice(userId: number, cihazId: number): Promise<boolean> { /* ... Cihazın kullanıcıya ait olup olmadığını kontrol et ... */ return true; }
// async checkUserOwnsCihazKullanici(userId: number, cihazKullaniciId: number): Promise<boolean> { /* ... CihazKullanici'nın kullanıcıya ait olup olmadığını kontrol et ... */ return true; }