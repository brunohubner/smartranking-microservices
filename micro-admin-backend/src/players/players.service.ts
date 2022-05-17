import { Injectable, Logger } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Player } from "./interfaces/player.interface"
import { Model } from "mongoose"
import * as mongoose from "mongoose"
import { RpcException } from "@nestjs/microservices"

@Injectable()
export class PlayersService {
    private readonly logger = new Logger(PlayersService.name)

    constructor(
        @InjectModel("Player") private readonly playerModel: Model<Player>
    ) {}

    async create(player: Player): Promise<void> {
        try {
            await new this.playerModel(player).save()
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }

    async findAll(): Promise<Player[]> {
        try {
            return this.playerModel.find()
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }

    async findById(_id: string): Promise<Player> {
        try {
            const player = await this.playerModel.findById(_id)
            if (!player) {
                throw new RpcException(
                    `The player with ID ${_id} does not exists.`
                )
            }
            return player
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }

    async findByEmail(email: string): Promise<Player> {
        try {
            const player = await this.playerModel.findOne({ email })
            if (!player) {
                throw new RpcException(
                    `The player with email ${email} does not exists.`
                )
            }
            return player
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }

    async findDuplicated({
        name,
        email,
        phoneNumber
    }: {
        name: string
        email: string
        phoneNumber: string
    }): Promise<Player> {
        try {
            return this.playerModel.findOne({
                $or: [{ name }, { email }, { phoneNumber }]
            })
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }

    async findMany(..._ids: string[]): Promise<Player[]> {
        try {
            const queries = _ids.map(_id => new mongoose.Types.ObjectId(_id))
            return this.playerModel.find({ _id: { $in: queries } })
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }

    async update(_id: string, player: Player): Promise<void> {
        try {
            await this.playerModel.findByIdAndUpdate(_id, player)
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }

    async remove(_id: string): Promise<void> {
        try {
            await this.playerModel.deleteOne({ _id })
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }
}
