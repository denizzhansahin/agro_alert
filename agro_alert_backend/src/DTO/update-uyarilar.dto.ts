import { Field, InputType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";

@InputType()
export class UpdateUyarilarDto {
    @Field({ nullable: true })
    @IsOptional()
    kullaniciId?: number;

    @Field({ nullable: true })
    @IsOptional()
    tespitId?: number;

    @Field({ nullable: true })
    @IsOptional()
    gozlemId?: number;

    @Field({ nullable: true })
    @IsOptional()
    uyari_seviyesi?: string;

    @Field({ nullable: true })
    @IsOptional()
    mesaj?: string;

    @Field({ nullable: true })
    @IsOptional()
    durum?: string;
}
