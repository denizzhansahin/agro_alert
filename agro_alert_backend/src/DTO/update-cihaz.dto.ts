import { Field, InputType, Int, PartialType } from "@nestjs/graphql";
import { CreateCihazDto } from "../DTO/create-cihaz.dto";

@InputType()
export class UpdateCihazDto extends PartialType(CreateCihazDto) {
    @Field(() => Int)
    id: number;
}
