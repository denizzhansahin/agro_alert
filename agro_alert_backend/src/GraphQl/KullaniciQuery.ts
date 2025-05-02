import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql'; // Int eklendi
import { UseGuards, ForbiddenException, NotFoundException } from '@nestjs/common'; // Exceptionlar eklendi

import { Kullanici } from 'src/Entities/kullanici';
import { KullaniciCreateDTO } from 'src/DTO/kullanici-create.dto';
import { KullaniciUpdateDTO } from 'src/DTO/kullanici-update.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
// import { Public } from 'src/auth/decorators/public.deacorator'; // Kullanılmıyor gibi
import { KullaniciService } from 'src/kullanicilar/kullanicilar.service';

@Resolver(() => Kullanici)
 // Guardları sınıf seviyesinde uygula
export class KullaniciGraphQl {
    constructor(private kullaniciService: KullaniciService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Query(() => [Kullanici], { name: 'kullanicilar' })
    async getAllKullanicilar(): Promise<Kullanici[]> {
        return this.kullaniciService.findAll();
    }

    @Roles(Role.ADMIN, Role.CIFTCI)
    @Query(() => Kullanici, { name: 'kullaniciBul', nullable: true }) // nullable: true eklendi
    async getKullanici(
        @Args('id', { type: () => Int }) id: number, // Arg tipi Int olmalı
        @Context() ctx: any,
    ): Promise<Kullanici | null> { // Dönüş tipi | null olarak güncellendi
        const currentUser = ctx.req.user;

        // Yetkilendirme: Çiftçi ise sadece kendi ID'sini sorgulayabilir
        if (currentUser.role === Role.CIFTCI && currentUser.id !== id) {
            throw new ForbiddenException('Başka bir kullanıcıyı sorgulayamazsınız.');
        }

        try {
            const user = await this.kullaniciService.kullaniciBul(id);
            return user; // Servis zaten bulunamazsa hata fırlatmalı veya null dönmeli
        } catch (error) {
             // Servis NotFoundException fırlatırsa null dön
             if (error instanceof NotFoundException) {
                 return null;
             }
             throw error; // Diğer hataları fırlat
        }
    }

    @Roles(Role.ADMIN) // Kullanıcı oluşturma sadece Admin yetkisi olmalı
    @Mutation(() => Kullanici, { name: 'kullaniciOlustur' })
    async createKullanici(
        @Args('kullaniciData') kullaniciData: KullaniciCreateDTO,
    ): Promise<Kullanici> {
        return this.kullaniciService.kullaniciOlustur(kullaniciData);
    }

    @Roles(Role.ADMIN, Role.CIFTCI)
    @Mutation(() => Kullanici, { name: 'kullaniciGuncelle' }) // name eklendi
    async kullaniciGuncelle( // async eklendi, dönüş tipi Promise<Kullanici> olmalı
        @Args('kullaniciId', { type: () => Int }) kullaniciId: number, // Arg tipi Int olmalı
        @Args('kullaniciGuncelleData') kullaniciGuncelleData: KullaniciUpdateDTO,
        @Context() ctx: any,
    ): Promise<Kullanici> {
         const currentUser = ctx.req;

         // Yetkilendirme: Çiftçi ise sadece kendi ID'sini güncelleyebilir
         if (currentUser.role === Role.CIFTCI && currentUser.id !== kullaniciId) {
             throw new ForbiddenException('Başka bir kullanıcıyı güncelleyemezsiniz.');
         }

        // Servis zaten bulunamazsa hata fırlatmalı
        return this.kullaniciService.kullaniciGuncelle(kullaniciId, kullaniciGuncelleData);
    }
}