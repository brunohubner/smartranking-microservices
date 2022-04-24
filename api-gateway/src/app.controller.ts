import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UsePipes,
    ValidationPipe
} from "@nestjs/common"
import {
    ClientProxy,
    ClientProxyFactory,
    Transport
} from "@nestjs/microservices"
import { env } from "./config/env"
import { CreateCategoryDto } from "./dtos/create-category.dto"

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
    createCategory(@Body() createCategoryDto: CreateCategoryDto) {
        return this.clientAdminBackend.emit(
            "create-category",
            createCategoryDto
        )
    }

    @Get("categories")
    @UsePipes(ValidationPipe)
    findAllCategories() {
        return this.clientAdminBackend.send("find-all-categories", "")
    }

    @Get("categories/:_id")
    @UsePipes(ValidationPipe)
    findCategoryById(@Param("_id") _id: string) {
        return this.clientAdminBackend.send("find-category-by-id", _id)
    }
}
