import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UsePipes,
    ValidationPipe
} from "@nestjs/common"
import { firstValueFrom, Observable } from "rxjs"
import { ClientProxyProvider } from "src/proxyrmq/client-proxy.provider"
import { CreateCategoryDto } from "./dtos/create-category.dto"
import { UpdateCategoryDto } from "./dtos/update-category.dto"

@Controller("api/v1/categories")
export class CategoriesController {
    constructor(private readonly clientProxyProvider: ClientProxyProvider) {}

    @Post()
    @UsePipes(ValidationPipe)
    async create(@Body() createCategoryDto: CreateCategoryDto): Promise<any> {
        const category = await firstValueFrom(
            this.clientProxyProvider.adminBackend.send(
                "find-category-by-name",
                createCategoryDto.name
            )
        )
        if (category) {
            throw new BadRequestException(
                `The category with name ${createCategoryDto.name} already exists.`
            )
        }

        return this.clientProxyProvider.adminBackend.emit(
            "create-category",
            createCategoryDto
        )
    }

    @Get()
    @UsePipes(ValidationPipe)
    findAll(): Observable<any[]> {
        return this.clientProxyProvider.adminBackend.send(
            "find-all-categories",
            ""
        )
    }

    @Get(":_id")
    @UsePipes(ValidationPipe)
    findById(@Param("_id") _id: string): Observable<any> {
        return this.clientProxyProvider.adminBackend.send(
            "find-category-by-id",
            _id
        )
    }

    @Patch(":_id")
    @UsePipes(ValidationPipe)
    async update(
        @Param("_id") _id: string,
        @Body() updateCategoryDto: UpdateCategoryDto
    ): Promise<any> {
        const category = await firstValueFrom(
            this.clientProxyProvider.adminBackend.send(
                "find-category-by-id",
                _id
            )
        )
        if (category) {
            throw new BadRequestException(
                `The category with ID ${_id} does not exists.`
            )
        }

        return this.clientProxyProvider.adminBackend.emit("update-category", {
            _id,
            category: updateCategoryDto
        })
    }
}
