import { Field, InputType } from "@nestjs/graphql";
import { IsOptional, IsArray } from "class-validator";

@InputType()
export class UpdateCihazKullaniciDto {
    @Field({ nullable: true })
    @IsOptional()
    kullaniciId?: number;

    @Field(() => [Number], { nullable: true })
    @IsArray()
    @IsOptional()
    cihazlarIds?: number[];
}
