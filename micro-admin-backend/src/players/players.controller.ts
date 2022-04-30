import { Controller, Logger } from "@nestjs/common"
import {
    Ctx,
    MessagePattern,
    Payload,
    RmqContext,
    RpcException
} from "@nestjs/microservices"
import { Player } from "./interfaces/player.interface"
import { PlayersService } from "./players.service"

const ackErrors: string[] = ["already a player", "not exists", "ObjectId"]

@Controller()
export class PlayersController {
    private readonly logger = new Logger(PlayersController.name)

    constructor(private readonly playersService: PlayersService) {}

    @MessagePattern("create-player")
    async create(
        @Payload() player: Player,
        @Ctx() context: RmqContext
    ): Promise<Player> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()

        try {
            const playerCreated = await this.playersService.create(player)
            await channel.ack(originalMessage)
            return playerCreated
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

    @MessagePattern("find-all-players")
    async findAll(@Ctx() context: RmqContext): Promise<Player[]> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()
        try {
            return this.playersService.findAll()
        } finally {
            await channel.ack(originalMessage)
        }
    }

    @MessagePattern("find-player-by-id")
    async findById(
        @Payload() _id: string,
        @Ctx() context: RmqContext
    ): Promise<Player> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()
        try {
            return this.playersService.findById(_id)
        } finally {
            await channel.ack(originalMessage)
        }
    }

    @MessagePattern("find-player-by-email")
    async findByEmail(
        @Payload() email: string,
        @Ctx() context: RmqContext
    ): Promise<Player> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()
        try {
            return this.playersService.findByEmail(email)
        } finally {
            await channel.ack(originalMessage)
        }
    }

    @MessagePattern("update-player")
    async update(
        @Payload() data: any,
        @Ctx() context: RmqContext
    ): Promise<Player> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()

        try {
            const _id = data._id
            const player: Player = data.player
            const playerUpdated = await this.playersService.update(_id, player)
            await channel.ack(originalMessage)
            return playerUpdated
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

    @MessagePattern("delete-player")
    async remove(
        @Payload() _id: string,
        @Ctx() context: RmqContext
    ): Promise<Player> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()
        try {
            return this.playersService.remove(_id)
        } finally {
            await channel.ack(originalMessage)
        }
    }
}
