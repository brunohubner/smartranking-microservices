import { IsOptional, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class UpdatePlayerDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    name?: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    urlAvatarPlayer?: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    category_id?: string
}
