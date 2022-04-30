import { IsNotEmpty, IsEmail, IsString, IsPhoneNumber } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreatePlayerDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty()
    @IsPhoneNumber()
    @IsNotEmpty()
    phoneNumber: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    category_id: string
}
