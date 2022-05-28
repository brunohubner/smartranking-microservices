import { Injectable, Logger } from "@nestjs/common"
import { RpcException } from "@nestjs/microservices"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { ChallengeStatus } from "./interfaces/challenge-status.enum"
import { Challenge } from "./interfaces/challenge.interface"
import * as momentTimezone from "moment-timezone"
import { ClientProxyProvider } from "src/proxyrmq/client-proxy.provider"
import { firstValueFrom } from "rxjs"

@Injectable()
export class ChallengesService {
    private readonly logger = new Logger(ChallengesService.name)

    constructor(
        @InjectModel("Challenge")
        private readonly challengeModel: Model<Challenge>,
        private readonly clientProxyProvider: ClientProxyProvider
    ) {}

    async create(challenge: Challenge): Promise<void> {
        try {
            challenge.dateTimeRequest = new Date()
            challenge.status = ChallengeStatus.PENDING
            
            const challengeCreated = new this.challengeModel(challenge)
            await challengeCreated.save()
            await firstValueFrom(this.clientProxyProvider.notifications.emit("new-challenge", challengeCreated))
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }

    async findAll(): Promise<Challenge[]> {
        try {
            return this.challengeModel.find()
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }

    async findById(_id: string): Promise<Challenge> {
        try {
            const challenge = await this.challengeModel.findById(_id)
            if (!challenge) {
                throw new RpcException(
                    `The challenge with ID ${_id} does not exists.`
                )
            }
            return challenge
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }

    async findChallengesOfAPlayer(player_id: any): Promise<Challenge[]> {
        try {
            return this.challengeModel.find().where("players").in(player_id)
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }

    async findAllAccomplished(category_id: string): Promise<Challenge[]> {
        try {
            return this.challengeModel
                .find()
                .where("category_id")
                .equals(category_id)
                .where("status")
                .equals(ChallengeStatus.ACCOMPLISHED)
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }

    async findAccomplishedByDate(
        category_id: string,
        date: string
    ): Promise<Challenge[]> {
        try {
            const newDate = new Date(`${date} 23:59:59`).getTime()
            return this.challengeModel
                .find()
                .where("category_id")
                .equals(category_id)
                .where("status")
                .equals(ChallengeStatus.ACCOMPLISHED)
                .where("dateTimeChallenge")
                .lte(newDate)
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }

    async update(_id: string, challenge: Challenge): Promise<void> {
        try {
            challenge.dateTimeResponse = new Date()
            await this.challengeModel.findByIdAndUpdate(_id, challenge)
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }

    async addMatchToChallenge(
        match_id: string,
        challenge: Challenge
    ): Promise<void> {
        try {
            challenge.status = ChallengeStatus.ACCOMPLISHED
            challenge.match = match_id
            await this.challengeModel.findByIdAndUpdate(
                challenge._id,
                challenge
            )
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }

    async remove(challenge: Challenge): Promise<void> {
        try {
            challenge.status = ChallengeStatus.CALLED_OFF
            await this.challengeModel.findByIdAndUpdate(
                challenge._id,
                challenge
            )
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }
}
