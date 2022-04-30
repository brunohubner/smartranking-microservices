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
import {
    ClientProxy,
    ClientProxyFactory,
    Transport
} from "@nestjs/microservices"
import { Observable } from "rxjs"
import { env } from "./config/env"
import { CreateCategoryDto } from "./dtos/create-category.dto"
import { UpdateCategoryDto } from "./dtos/update-category.dto"

@Controller("api/v1")
export class AppController {
    private clientAdminBackend: ClientProxy

    constructor() {
        this.clientAdminBackend = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [env.RABBITMQ_URL_CONNECTION],
                queue: "admin-backend"
            }
        })
    }

    @Post("categories")
    @UsePipes(ValidationPipe)
    createCategory(
        @Body() createCategoryDto: CreateCategoryDto
    ): Observable<any> {
        return this.clientAdminBackend.send(
            "create-category",
            createCategoryDto
        )
    }

    @Get("categories")
    @UsePipes(ValidationPipe)
    findAllCategories(): Observable<any> {
        return this.clientAdminBackend.send("find-all-categories", "")
    }

    @Get("categories/:_id")
    @UsePipes(ValidationPipe)
    findCategoryById(@Param("_id") _id: string): Observable<any> {
        return this.clientAdminBackend.send("find-category-by-id", _id)
    }

    @Patch("categories/:_id")
    @UsePipes(ValidationPipe)
    updateCategory(
        @Param("_id") _id: string,
        @Body() updateCategoryDto: UpdateCategoryDto
    ): Observable<any> {
        return this.clientAdminBackend.send("update-category", {
            _id,
            category: updateCategoryDto
        })
    }
}
