import { Controller, Logger } from "@nestjs/common"
import { AppService } from "./app.service"
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices"
import { Category } from "./interfaces/categories/category.interface"

@Controller()
export class AppController {
    private readonly logger = new Logger(AppController.name)

    constructor(private readonly appService: AppService) {}

    @EventPattern("create-category")
    async createCategory(@Payload() category: Category): Promise<Category> {
        return this.appService.createCategory(category)
    }

    @MessagePattern("find-all-categories")
    async findAllCategories(): Promise<Category[]> {
        return this.appService.findAllCategories()
    }

    @MessagePattern("find-category-by-id")
    async findCategoryById(@Payload() _id: string): Promise<Category> {
        return this.appService.findCategoryById(_id)
    }
}
