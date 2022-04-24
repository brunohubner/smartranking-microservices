import { ArrayMinSize, IsArray, IsOptional, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { Event } from "src/interfaces/event.interface"

export class UpdateCategoryDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    description: string

    @ApiProperty()
    @IsArray()
    @ArrayMinSize(1)
    events: Event[]
}
