import { Controller, Logger } from "@nestjs/common"
import {
    Ctx,
    EventPattern,
    Payload,
    RmqContext,
    RpcException
} from "@nestjs/microservices"
import { Challenge } from "src/interfaces/challenge.interface"
import { NotificationsService } from "./notifications.service"

const ackErrors: string[] = []

@Controller()
export class NotificationsController {
    private readonly logger = new Logger(NotificationsController.name)

    constructor(private readonly notificationsService: NotificationsService) {}

    @EventPattern("new-challenge")
    async create(
        @Payload() challenge: Challenge,
        @Ctx() context: RmqContext
    ): Promise<void> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()

        try {
            await this.notificationsService.sendMailToAdversary(challenge)
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
