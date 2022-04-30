import { Controller, Logger } from "@nestjs/common"
import { AppService } from "./app.service"
import { Ctx, MessagePattern, Payload, RmqContext } from "@nestjs/microservices"
import { Category } from "./interfaces/categories/category.interface"

const ackErrors: string[] = ["already registered", "not exists"]

@Controller()
export class AppController {
    private readonly logger = new Logger(AppController.name)

    constructor(private readonly appService: AppService) {}

    @MessagePattern("create-category")
    async createCategory(
        @Payload() category: Category,
        @Ctx() context: RmqContext
    ): Promise<Category> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()

        try {
            const categoryCreated = await this.appService.createCategory(
                category
            )
            await channel.ack(originalMessage)
            return categoryCreated
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
        try {
            return this.appService.findAllCategories()
        } finally {
            await channel.ack(originalMessage)
        }
    }

    @MessagePattern("find-category-by-id")
    async findCategoryById(
        @Payload() _id: string,
        @Ctx() context: RmqContext
    ): Promise<Category> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()
        try {
            return this.appService.findCategoryById(_id)
        } finally {
            await channel.ack(originalMessage)
        }
    }

    @MessagePattern("update-category")
    async updateCategory(
        @Payload() data: any,
        @Ctx() context: RmqContext
    ): Promise<Category> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()

        try {
            const _id = data._id
            const category: Category = data.category
            const categoryUpdated = await this.appService.updateCategory(
                _id,
                category
            )
            await channel.ack(originalMessage)
            return categoryUpdated
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            ackErrors.forEach(async ackError => {
                if (error?.message?.includes(ackError)) {
                    await channel.ack(originalMessage)
                }
            })
        }
    }
}
