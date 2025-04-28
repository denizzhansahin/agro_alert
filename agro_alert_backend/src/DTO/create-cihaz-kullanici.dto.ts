import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsArray, IsOptional } from "class-validator";

@InputType()
export class CreateCihazKullaniciDto {
    @Field()
    @IsNotEmpty()
    kullaniciId: number;

    @Field(() => [Number], { nullable: true })
    @IsArray()
    @IsOptional()
    cihazlarIds?: number[];
}
