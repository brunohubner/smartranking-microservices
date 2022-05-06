import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsDateString,
    IsNotEmpty
} from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateChallengeDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    dateTimeChallenge: Date

    @ApiProperty()
    @IsNotEmpty()
    challenger: string

    @ApiProperty()
    @IsNotEmpty()
    category_id: string

    @ApiProperty()
    @IsArray()
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    players: string[]
}
