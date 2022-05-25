import { Controller, Logger } from "@nestjs/common"
import {
    Ctx,
    EventPattern,
    Payload,
    RmqContext,
    RpcException
} from "@nestjs/microservices"
import { Match } from "./interfaces/match.interface"
import { RankingsService } from "./rankings.service"

const ackErrors: string[] = ["E11000", "required", "must be"]

@Controller()
export class RankingsController {
    private readonly logger = new Logger(RankingsController.name)

    constructor(private readonly rankingsService: RankingsService) {}

    @EventPattern("process-match")
    async create(
        @Payload() data: any,
        @Ctx() context: RmqContext
    ): Promise<void> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()

        try {
            const match_id: string = data.match_id
            const match: Match = data.match
            await this.rankingsService.processMatch(match_id, match)
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
