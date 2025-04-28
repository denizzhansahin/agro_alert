import { IsString, IsEmail, IsOptional, IsBase64, IsEnum } from "class-validator";
import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class KullaniciUpdateDTO {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    nickname?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    isim?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    soyisim?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    sehir?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    ilce?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    tam_adres?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    tel_no?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsBase64()
    profil_foto_base64?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsEmail()
    eposta?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    sifre?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsEnum(["ADMIN" , "ÇİFTÇİ" ],
        {message : 'Valid role required'}
    )
    role : "ADMIN" | "ÇİFTÇİ" 
}
