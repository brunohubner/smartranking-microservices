import { Controller, Logger } from "@nestjs/common"
import {
    Ctx,
    EventPattern,
    Payload,
    RmqContext,
    RpcException
} from "@nestjs/microservices"
import { Match } from "./interfaces/match.interface"
import { MatchesService } from "./matches.service"

const ackErrors: string[] = ["E11000", "required", "must be"]
@Controller()
export class MatchesController {
    private readonly logger = new Logger(MatchesController.name)

    constructor(private readonly matchService: MatchesService) {}

    @EventPattern("create-match")
    async create(
        @Payload() match: Match,
        @Ctx() context: RmqContext
    ): Promise<void> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()

        try {
            await this.matchService.create(match)
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
