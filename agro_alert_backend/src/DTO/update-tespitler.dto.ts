import { Field, InputType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";

@InputType()
export class UpdateTespitlerDto {
    @Field({ nullable: true })
    @IsOptional()
    gozlemId?: number;

    @Field({ nullable: true })
    @IsOptional()
    tespit_tipi?: string;

    @Field({ nullable: true })
    @IsOptional()
    guven_skoru?: number;

    @Field({ nullable: true })
    @IsOptional()
    sinirlayici_kutu_verisi?: string;
}
