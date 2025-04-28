import { IsString, IsEmail, IsOptional, IsBase64, IsEnum } from "class-validator";
import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class KullaniciCreateDTO {
    @Field()
    @IsString()
    nickname: string;

    @Field()
    @IsString()
    isim: string;

    @Field()
    @IsString()
    soyisim: string;

    @Field()
    @IsString()
    sehir: string;

    @Field()
    @IsString()
    ilce: string;

    @Field()
    @IsString()
    tam_adres: string;

    @Field()
    @IsString()
    tel_no: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsBase64()
    profil_foto_base64?: string;

    @Field()
    @IsEmail()
    eposta: string;

    @Field()
    @IsString()
    sifre: string;

    @Field()
    @IsEnum(["ADMIN" , "ÇİFTÇİ" ],
        {message : 'Valid role required'}
    )
    role : "ADMIN" | "ÇİFTÇİ" 
}
