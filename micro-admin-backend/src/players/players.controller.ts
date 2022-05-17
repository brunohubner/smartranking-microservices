import { Controller, Logger } from "@nestjs/common"
import {
    Ctx,
    EventPattern,
    MessagePattern,
    Payload,
    RmqContext,
    RpcException
} from "@nestjs/microservices"
import { Player } from "./interfaces/player.interface"
import { PlayersService } from "./players.service"

const ackErrors: string[] = [
    "E11000",
    "already a player",
    "not exists",
    "ObjectId"
]

@Controller()
export class PlayersController {
    private readonly logger = new Logger(PlayersController.name)

    constructor(private readonly playersService: PlayersService) {}

    @EventPattern("create-player")
    async create(
        @Payload() player: Player,
        @Ctx() context: RmqContext
    ): Promise<void> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()

        try {
            await this.playersService.create(player)
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

    @MessagePattern("find-player-by-email-or-phone-number")
    async findByEmailOrPhoneNumber(
        @Payload() data: any,
        @Ctx() context: RmqContext
    ): Promise<Player> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()
        try {
            return this.playersService.findDuplicated({
                email: data?.email,
                phoneNumber: data?.phoneNumber,
                name: data?.name
            })
        } finally {
            await channel.ack(originalMessage)
        }
    }

    @MessagePattern("find-many-players")
    async findMany(
        @Payload() _ids: string[],
        @Ctx() context: RmqContext
    ): Promise<Player[]> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()
        try {
            return this.playersService.findMany(..._ids)
        } finally {
            await channel.ack(originalMessage)
        }
    }

    @EventPattern("update-player")
    async update(
        @Payload() data: any,
        @Ctx() context: RmqContext
    ): Promise<void> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()

        try {
            const _id = data._id
            const player: Player = data.player
            await this.playersService.update(_id, player)
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

    @EventPattern("delete-player")
    async remove(
        @Payload() _id: string,
        @Ctx() context: RmqContext
    ): Promise<void> {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()
        try {
            await this.playersService.remove(_id)
        } finally {
            await channel.ack(originalMessage)
        }
    }
}
