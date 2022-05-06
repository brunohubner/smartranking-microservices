import { IsNotEmpty } from "class-validator"
import { Result } from "../interfaces/result.interface"
import { ApiProperty } from "@nestjs/swagger"

export class AddChallengeToMatchDto {
    @ApiProperty()
    @IsNotEmpty()
    winner: string

    @ApiProperty()
    @IsNotEmpty()
    result: Result[]
}
