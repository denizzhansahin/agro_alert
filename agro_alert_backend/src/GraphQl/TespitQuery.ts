import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards, NotFoundException } from '@nestjs/common'; // NotFoundException eklendi
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';     // Yolu doğrulayın
import { Tespitler } from 'src/Entities/tespitler';
import { TespitlerService } from 'src/tespitler/tespitler.service';
import { CreateTespitlerDto } from 'src/DTO/create-tespitler.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';



@Resolver(() => Tespitler)
@UseGuards(JwtAuthGuard) // Giriş yapmış olmayı zorunlu kıl
// @UseGuards(JwtAuthGuard, RolesGuard) // Rol kontrolü de gerekirse bu satırı kullanın
export class TespitlerResolver {
    constructor(private readonly tespitlerService: TespitlerService) { }

    // --- Queries ---

    /**
     * Belirtilen Gozlem ID'sine ait tüm tespitleri getirir.
     */
    // @Roles(Role.ADMIN, Role.USER) // Gerekirse rol bazlı erişim ekleyin
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Query(() => [Tespitler], { name: 'tespitlerByGozlemId' })
    async findTespitlerByGozlemId(
        @Args('gozlemId', { type: () => Int }) gozlemId: number,
    ): Promise<Tespitler[]> {
        return this.tespitlerService.findAllByGozlem(gozlemId);
    }

    /**
     * Belirtilen ID'ye sahip tek bir tespiti getirir.
     * Bulunamazsa null döner.
     */
    // @Roles(Role.ADMIN, Role.USER) // Gerekirse rol bazlı erişim ekleyin
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Query(() => Tespitler, { name: 'tespitById', nullable: true })
    async findTespitById(
        @Args('id', { type: () => Int }) id: number,
    ): Promise<Tespitler | null> {
        try {
            // Servis metodu Tespitler veya NotFoundException döndürecek
            return await this.tespitlerService.findOneById(id);
        } catch (error) {
            // Servisten NotFoundException gelirse null döndür
            if (error instanceof NotFoundException) {
                return null;
            }
            // Diğer hataları tekrar fırlat
            throw error;
        }
    }

    // --- Mutations ---

    /**
     * Yeni bir tespit oluşturur.
     */
    // @Roles(Role.ADMIN, Role.USER) // Gerekirse rol bazlı erişim ekleyin
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Mutation(() => Tespitler, { name: 'createTespit' })
    async createTespit(
        @Args('createTespitData', { type: () => CreateTespitlerDto }) createTespitData: CreateTespitlerDto,
    ): Promise<Tespitler> {
        return this.tespitlerService.create(createTespitData);
    }
}