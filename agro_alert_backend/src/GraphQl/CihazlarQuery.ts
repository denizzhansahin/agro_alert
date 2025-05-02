import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CihazlarService } from '../cihazlar/cihazlar.service';
import { Cihazlar } from '../Entities/cihazlar';
import { CreateCihazDto } from '../DTO/create-cihaz.dto';
import { UpdateCihazDto } from '../DTO/update-cihaz.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Resolver(() => Cihazlar)
export class CihazlarGraphQl {
  constructor(private readonly cihazlarService: CihazlarService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => Cihazlar)
  async createCihaz(@Args('createCihazDto') createCihazDto: CreateCihazDto): Promise<Cihazlar> {
    return this.cihazlarService.createCihaz(createCihazDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN,Role.CIFTCI)
  @Mutation(() => Cihazlar)
  async updateCihaz(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateCihazDto') updateCihazDto: UpdateCihazDto,
  ): Promise<Cihazlar> {
    return this.cihazlarService.updateCihaz(id, updateCihazDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN,Role.CIFTCI)
  @Query(() => Cihazlar)
  async getCihazById(@Args('id', { type: () => Int }) id: number): Promise<Cihazlar> {
    return this.cihazlarService.getCihazById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Query(() => [Cihazlar])
  async getAllCihazlar(): Promise<Cihazlar[]> {
    return this.cihazlarService.getAllCihazlar();
  }
}
