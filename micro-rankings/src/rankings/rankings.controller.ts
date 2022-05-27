import { Controller, Logger } from "@nestjs/common"
import {
    Ctx,
    EventPattern,
    MessagePattern,
    Payload,
    RmqContext,
    RpcException
} from "@nestjs/microservices"
import { Match } from "./interfaces/match.interface"
import { RankingResponse } from "./interfaces/ranking-response.interface"
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

    @MessagePattern("find-by-category-id")
    async findByCategoryId(
        @Payload() data: any,
        @Ctx() context: RmqContext
    ): Promise<RankingResponse[]> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()

        try {
            const category_id: string = data.category_id
            const date: string = data.date
            return this.rankingsService.findByCategoryId(category_id, date)
        } finally {
            await channel.ack(originalMessage)
        }
    }
}
