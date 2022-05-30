import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UsePipes,
    ValidationPipe
} from "@nestjs/common"

import { CategoriesService } from "./categories.service"
import { CreateCategoryDto } from "./dtos/create-category.dto"
import { UpdateCategoryDto } from "./dtos/update-category.dto"

@Controller("api/v1/categories")
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async create(@Body() createCategoryDto: CreateCategoryDto): Promise<void> {
        return this.categoriesService.create(createCategoryDto)
    }

    @Get()
    @UsePipes(ValidationPipe)
    findAll(): Promise<any[]> {
        return this.categoriesService.findAll()
    }

    @Get(":_id")
    @UsePipes(ValidationPipe)
    findById(@Param("_id") _id: string): Promise<any> {
        return this.categoriesService.findById(_id)
    }

    @Patch(":_id")
    @UsePipes(ValidationPipe)
    async update(
        @Param("_id") _id: string,
        @Body() updateCategoryDto: UpdateCategoryDto
    ): Promise<any> {
        return this.categoriesService.update(_id, updateCategoryDto)
    }
}
