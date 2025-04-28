import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional } from "class-validator";

@InputType()
export class CreateTespitlerDto {
    @Field()
    @IsNotEmpty()
    gozlemId: number;

    @Field()
    @IsNotEmpty()
    tespit_tipi: string;

    @Field({ nullable: true })
    @IsOptional()
    guven_skoru?: number;

    @Field({ nullable: true })
    @IsOptional()
    sinirlayici_kutu_verisi?: string;
}
