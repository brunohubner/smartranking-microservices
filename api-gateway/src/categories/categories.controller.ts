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
import { Observable } from "rxjs"
import { ClientProxyProvider } from "src/common/providers/client-proxy.provider"
import { CreateCategoryDto } from "./dtos/create-category.dto"
import { UpdateCategoryDto } from "./dtos/update-category.dto"

@Controller("api/v1/categories")
export class CategoriesController {
    constructor(private readonly clientProxyProvider: ClientProxyProvider) {}

    @Post()
    @UsePipes(ValidationPipe)
    create(@Body() createCategoryDto: CreateCategoryDto): Observable<any> {
        return this.clientProxyProvider.adminBackend.send(
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
    update(
        @Param("_id") _id: string,
        @Body() updateCategoryDto: UpdateCategoryDto
    ): Observable<any> {
        return this.clientProxyProvider.adminBackend.send("update-category", {
            _id,
            category: updateCategoryDto
        })
    }
}
