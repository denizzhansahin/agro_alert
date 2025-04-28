import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateCihazDto {
    @Field()
    cihaz_seri_no: string;

    @Field({ nullable: true })
    notlar?: string;

    @Field({ nullable: true })
    isim?: string;

    @Field()
    durum: string;

    @Field({ nullable: true })
    konum_enlem?: number;

    @Field({ nullable: true })
    konum_boylam?: number;

    @Field({ nullable: true })
    son_gorulme?: Date;
}
