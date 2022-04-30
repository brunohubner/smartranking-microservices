import { IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class UpdatePlayerDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    name?: string

    @ApiProperty()
    @IsEmail()
    @IsOptional()
    email?: string

    @ApiProperty()
    @IsPhoneNumber()
    @IsOptional()
    phoneNumber?: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    urlAvatarPlayer?: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    category_id: string
}
