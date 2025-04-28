import { Field, InputType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";

@InputType()
export class UpdateGozlemlerDto {
    @Field({ nullable: true })
    @IsOptional()
    cihazId?: number;

    @Field({ nullable: true })
    @IsOptional()
    gozlem_tipi?: string;

    @Field({ nullable: true })
    @IsOptional()
    sayisal_deger?: number;

    @Field({ nullable: true })
    @IsOptional()
    metin_deger?: string;

    @Field({ nullable: true })
    @IsOptional()
    resim_base64?: string;

    @Field({ nullable: true })
    @IsOptional()
    gps_enlem?: number;

    @Field({ nullable: true })
    @IsOptional()
    gps_boylam?: number;
}
