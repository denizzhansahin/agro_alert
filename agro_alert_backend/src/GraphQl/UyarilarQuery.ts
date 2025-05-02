import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards, NotFoundException, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { Uyarilar } from 'src/Entities/uyarilar';
import { UyarilarService } from 'src/uyarilar/uyarilar.service';
import { CreateUyarilarDto } from 'src/DTO/create-uyarilar.dto';

@Resolver(() => Uyarilar)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UyarilarResolver {
    constructor(private readonly uyarilarService: UyarilarService) {}

    // --- Queries ---

    @Roles(Role.ADMIN, Role.CIFTCI)
    @Query(() => Uyarilar, { name: 'uyariById', nullable: true })
    async findUyariById(
        @Args('id', { type: () => Int }) id: number,
        @Context() ctx: any,
    ): Promise<Uyarilar | null> {
        try {
            const uyari = await this.uyarilarService.findOneById(id);
            const currentUser = ctx.req.user;

            if (currentUser.role === Role.CIFTCI) {
                const uyariSahibiId = uyari.tespit?.gozlem?.cihaz_kullanici?.kullanici?.id;
                if (!uyariSahibiId || uyariSahibiId !== currentUser.sub) {
                    throw new ForbiddenException("Bu uyarıyı görme yetkiniz yok.");
                }
            }

            return uyari;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ForbiddenException) {
                throw error;
            }
            throw error;
        }
    }

    @Roles(Role.ADMIN, Role.CIFTCI)
    @Query(() => [Uyarilar], { name: 'uyarilarByKullaniciId' })
    async findUyarilarByKullaniciId(
        @Args('kullaniciId', { type: () => Int }) kullaniciId: number,
        @Context() ctx: any,
    ): Promise<Uyarilar[]> {
        const currentUser = ctx.req.user;

        if (currentUser.role === Role.CIFTCI && currentUser.id !== kullaniciId) {
            throw new ForbiddenException("Başka bir kullanıcının uyarılarını sorgulayamazsınız.");
        }

        return this.uyarilarService.findAllByKullanici(kullaniciId);
    }

    @Roles(Role.ADMIN, Role.CIFTCI)
    @Query(() => Uyarilar, { name: 'uyariByTespitId', nullable: true })
    async findUyariByTespitId(
        @Args('tespitId', { type: () => Int }) tespitId: number,
        @Context() ctx: any,
    ): Promise<Uyarilar | null> {
        try {
            const uyari = await this.uyarilarService.findOneByTespitId(tespitId);
            if (!uyari) return null;

            const currentUser = ctx.req.user;

            if (currentUser.role === Role.CIFTCI) {
                const uyariSahibiId = uyari.tespit?.gozlem?.cihaz_kullanici?.kullanici?.id;
                if (!uyariSahibiId || uyariSahibiId !== currentUser.id) {
                    throw new ForbiddenException("Bu tespite ait uyarıyı görme yetkiniz yok.");
                }
            }

            return uyari;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ForbiddenException) {
                throw error;
            }
            throw error;
        }
    }

    // --- Mutations ---

    @Roles(Role.ADMIN, Role.CIFTCI)
    @Mutation(() => Uyarilar, { name: 'createUyari' })
    async createUyari(
        @Args('createUyariData', { type: () => CreateUyarilarDto }) createUyariData: CreateUyarilarDto,
        @Context() ctx: any,
    ): Promise<Uyarilar> {
        const currentUser = ctx.req.user;

        if (currentUser.role === Role.CIFTCI && createUyariData.kullaniciId !== currentUser.id) {
            throw new ForbiddenException("Başka bir kullanıcı için uyarı oluşturamazsınız.");
        }

        return this.uyarilarService.create(createUyariData, currentUser.id);
    }
}