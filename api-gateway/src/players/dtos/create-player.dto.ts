import { IsNotEmpty, IsEmail, IsString, IsPhoneNumber } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreatePlayerDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly name: string

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    readonly email: string

    @ApiProperty()
    @IsPhoneNumber()
    @IsNotEmpty()
    readonly phoneNumber: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly category_id: string
}
