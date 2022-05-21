import { Injectable, Logger } from "@nestjs/common"
import { RpcException } from "@nestjs/microservices"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { ChallengesService } from "src/challenges/challenges.service"
import { Match } from "./interfaces/match.interface"

@Injectable()
export class MatchesService {
    private readonly logger = new Logger(MatchesService.name)

    constructor(
        @InjectModel("Match") private readonly matchModel: Model<Match>,
        private readonly challengesService: ChallengesService
    ) {}

    async create(match: Match): Promise<void> {
        try {
            const matchCreated = await new this.matchModel(match).save()
            const challenge = await this.challengesService.findById(
                match.challenge
            )
            await this.challengesService.addMatchToChallenge(
                matchCreated._id.toString(),
                challenge
            )
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }
}
