import { Controller, Logger } from "@nestjs/common"
import {
    Ctx,
    EventPattern,
    MessagePattern,
    Payload,
    RmqContext,
    RpcException
} from "@nestjs/microservices"
import { CategoriesService } from "./categories.service"
import { Category } from "./interfaces/category.interface"

const ackErrors: string[] = ["already registered", "not exists", "ObjectId"]

@Controller()
export class CategoriesController {
    private readonly logger = new Logger(CategoriesController.name)

    constructor(private readonly categoriesService: CategoriesService) {}

    @EventPattern("create-category")
    async create(
        @Payload() category: Category,
        @Ctx() context: RmqContext
    ): Promise<void> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()

        try {
            await this.categoriesService.create(category)
            await channel.ack(originalMessage)
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            ackErrors.forEach(async ackError => {
                if (error?.message?.includes(ackError)) {
                    await channel.ack(originalMessage)
                }
            })
            throw new RpcException(error.message)
        }
    }

    @MessagePattern("find-all-categories")
    async findAll(@Ctx() context: RmqContext): Promise<Category[]> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()
        try {
            return this.categoriesService.findAll()
        } finally {
            await channel.ack(originalMessage)
        }
    }

    @MessagePattern("find-category-by-id")
    async findById(
        @Payload() _id: string,
        @Ctx() context: RmqContext
    ): Promise<Category> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()
        try {
            return this.categoriesService.findById(_id)
        } finally {
            await channel.ack(originalMessage)
        }
    }

    @MessagePattern("find-category-by-name")
    async findByName(
        @Payload() name: string,
        @Ctx() context: RmqContext
    ): Promise<Category> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()
        try {
            return this.categoriesService.findByName(name)
        } finally {
            await channel.ack(originalMessage)
        }
    }

    @EventPattern("update-category")
    async update(
        @Payload() data: any,
        @Ctx() context: RmqContext
    ): Promise<void> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()

        try {
            const _id = data._id
            const category: Category = data.category
            await this.categoriesService.update(_id, category)
            await channel.ack(originalMessage)
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            ackErrors.forEach(async ackError => {
                if (error?.message?.includes(ackError)) {
                    await channel.ack(originalMessage)
                }
            })
            throw new RpcException(error.message)
        }
    }
}
