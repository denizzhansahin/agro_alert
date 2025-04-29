import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { Kullanici } from 'src/Entities/kullanici';
import { KullaniciCreateDTO } from 'src/DTO/kullanici-create.dto';
import { KullaniciUpdateDTO } from 'src/DTO/kullanici-update.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { Public } from 'src/auth/decorators/public.deacorator';
import { KullaniciService } from 'src/kullanicilar/kullanicilar.service';

@Resolver(() => Kullanici)
export class KullaniciGraphQl {
    constructor(private kullaniciService: KullaniciService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Query(() => [Kullanici], { name: 'kullanicilar' })
    async getAllKullanicilar(): Promise<Kullanici[]> {
        return this.kullaniciService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.CIFTCI)
    @Query(() => Kullanici, { name: 'kullaniciBul' })
    async getKullanici(@Args('id') id: number): Promise<Kullanici> {
        const user = await this.kullaniciService.kullaniciBul(id);

        if (!user) {
            throw new Error('Kullanıcı Yok');
        }

        return user;
    }

    @Public()
    @Mutation(() => Kullanici, { name: 'kullaniciOlustur' })
    async createKullanici(
        @Args('kullaniciData') kullaniciData: KullaniciCreateDTO,
    ): Promise<Kullanici> {
        return this.kullaniciService.kullaniciOlustur(kullaniciData);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.CIFTCI)
    @Mutation((returns) => Kullanici)
    kullaniciGuncelle(
        @Args('kullaniciId') kullaniciId: number,
        @Args('kullaniciGuncelleData') kullaniciGuncelleData: KullaniciUpdateDTO,
    ) {
        return this.kullaniciService.kullaniciGuncelle(kullaniciId, kullaniciGuncelleData);
    }
}