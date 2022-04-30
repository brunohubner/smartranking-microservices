import { Controller, Logger } from "@nestjs/common"
import { AppService } from "./app.service"
import {
    Ctx,
    EventPattern,
    MessagePattern,
    Payload,
    RmqContext
} from "@nestjs/microservices"
import { Category } from "./interfaces/categories/category.interface"

const ackErrors: string[] = ["already registered"]

@Controller()
export class AppController {
    private readonly logger = new Logger(AppController.name)

    constructor(private readonly appService: AppService) {}

    @EventPattern("create-category")
    async createCategory(
        @Payload() category: Category,
        @Ctx() context: RmqContext
    ): Promise<void> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()

        try {
            await this.appService.createCategory(category)
            await channel.ack(originalMessage)
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            ackErrors.forEach(async ackError => {
                if (error?.message?.includes(ackError)) {
                    await channel.ack(originalMessage)
                }
            })
        }
    }

    @MessagePattern("find-all-categories")
    async findAllCategories(@Ctx() context: RmqContext): Promise<Category[]> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()
        await channel.ack(originalMessage)
        return this.appService.findAllCategories()
    }

    @MessagePattern("find-category-by-id")
    async findCategoryById(
        @Payload() _id: string,
        @Ctx() context: RmqContext
    ): Promise<Category> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()
        await channel.ack(originalMessage)
        return this.appService.findCategoryById(_id)
    }
}
