import { Controller, Logger } from "@nestjs/common"
import {
    Ctx,
    EventPattern,
    MessagePattern,
    Payload,
    RmqContext,
    RpcException
} from "@nestjs/microservices"
import { ChallengesService } from "./challenges.service"
import { Challenge } from "./interfaces/challenge.interface"

const ackErrors: string[] = ["E11000", "not exists", "ObjectId", "required"]

@Controller()
export class ChallengesController {
    private readonly logger = new Logger(ChallengesController.name)

    constructor(private readonly challengeService: ChallengesService) {}

    @EventPattern("create-challenge")
    async create(
        @Payload() challege: Challenge,
        @Ctx() context: RmqContext
    ): Promise<void> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()

        try {
            await this.challengeService.create(challege)
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

    @MessagePattern("find-all-challenges")
    async findAll(@Ctx() context: RmqContext): Promise<Challenge[]> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()
        try {
            return this.challengeService.findAll()
        } finally {
            await channel.ack(originalMessage)
        }
    }

    @MessagePattern("find-all-challenges-of-a-player")
    async findChallengesOfAPlayer(
        @Payload() player_id: string,
        @Ctx() context: RmqContext
    ): Promise<Challenge[]> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()
        try {
            return this.challengeService.findChallengesOfAPlayer(player_id)
        } finally {
            await channel.ack(originalMessage)
        }
    }

    @MessagePattern("find-challenge-by-id")
    async findById(
        @Payload() _id: string,
        @Ctx() context: RmqContext
    ): Promise<Challenge> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()
        try {
            return this.challengeService.findById(_id)
        } finally {
            await channel.ack(originalMessage)
        }
    }

    @MessagePattern("find-accomplished")
    async findAccomplished(
        @Payload() data: any,
        @Ctx() context: RmqContext
    ): Promise<Challenge[]> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()
        try {
            const category_id: string = data.category_id
            const date: string = data.date

            if (date) {
                return await this.challengeService.findAccomplishedByDate(
                    category_id,
                    date
                )
            }
            return await this.challengeService.findAllAccomplished(category_id)
        } finally {
            await channel.ack(originalMessage)
        }
    }

    @EventPattern("update-challenge")
    async update(
        @Payload() data: any,
        @Ctx() context: RmqContext
    ): Promise<void> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()

        try {
            const _id = data._id
            const challenge: Challenge = data.challenge
            await this.challengeService.update(_id, challenge)
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

    @MessagePattern("delete-challenge")
    async remove(
        @Payload() challege: Challenge,
        @Ctx() context: RmqContext
    ): Promise<void> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()

        try {
            await this.challengeService.remove(challege)
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
