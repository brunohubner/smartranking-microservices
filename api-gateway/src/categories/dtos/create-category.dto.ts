import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { Event } from "src/categories/interfaces/event.interface"

export class CreateCategoryDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly name: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string

    @ApiProperty()
    @IsArray()
    @ArrayMinSize(1)
    events: Event[]
}
