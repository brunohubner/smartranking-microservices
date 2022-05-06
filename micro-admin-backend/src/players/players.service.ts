import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException
} from "@nestjs/common"
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

    async create(player: Player): Promise<Player> {
        try {
            const playerExists = await this.playerModel.findOne({
                $or: [
                    { email: player.email },
                    { phoneNumber: player.phoneNumber }
                ]
            })
            if (playerExists) {
                throw new RpcException(
                    `There is already a player using this email or phone number.`
                )
            }

            const playerCreated = new this.playerModel(player)
            await playerCreated.save()
            return playerCreated
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

    async findMany(..._ids: string[]): Promise<Player[]> {
        try {
            const queries = _ids.map(_id => new mongoose.Types.ObjectId(_id))
            return this.playerModel.find({ _id: { $in: queries } })
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }

    async update(_id: string, player: Player): Promise<Player> {
        try {
            const [playerExists, emailDuplicated, phoneNumberDuplicated] =
                await Promise.all([
                    this.findById(_id),
                    this.playerModel.findOne({ email: player?.email }),
                    this.playerModel.findOne({
                        phoneNumber: player?.phoneNumber
                    })
                ])

            if (
                player?.email &&
                _id !== emailDuplicated?._id.toString() &&
                player.email === emailDuplicated?.email
            ) {
                throw new RpcException(
                    `There is already a player using the email ${player.email}.`
                )
            }
            if (
                player?.phoneNumber &&
                _id !== phoneNumberDuplicated?._id.toString() &&
                player.phoneNumber === phoneNumberDuplicated?.phoneNumber
            ) {
                throw new RpcException(
                    `There is already a player using the phone number ${player.phoneNumber}.`
                )
            }

            for (const key in player) {
                playerExists[key] = player[key]
            }

            await playerExists.save()
            return playerExists
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }

    async remove(_id: string): Promise<Player> {
        try {
            const player = await this.findById(_id)
            await this.playerModel.deleteOne({ _id })
            return player
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }
}
