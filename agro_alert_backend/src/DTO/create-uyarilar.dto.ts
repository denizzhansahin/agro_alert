import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional } from "class-validator";

@InputType()
export class CreateUyarilarDto {
    @Field()
    @IsNotEmpty()
    kullaniciId: number;

    @Field({ nullable: true })
    @IsOptional()
    tespitId?: number;

    @Field({ nullable: true })
    @IsOptional()
    gozlemId?: number;

    @Field()
    @IsNotEmpty()
    uyari_seviyesi: string;

    @Field()
    @IsNotEmpty()
    mesaj: string;

    @Field()
    @IsNotEmpty()
    durum: string;
}
