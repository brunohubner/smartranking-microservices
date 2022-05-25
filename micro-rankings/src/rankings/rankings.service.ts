import { Injectable, Logger } from "@nestjs/common"
import { RpcException } from "@nestjs/microservices"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { firstValueFrom } from "rxjs"
import { ClientProxyProvider } from "src/proxyrmq/client-proxy.provider"
import { Category } from "./interfaces/category.interface"
import { EventName } from "./interfaces/event-name.enum"
import { Match } from "./interfaces/match.interface"
import { Ranking } from "./interfaces/rankings.schema"

@Injectable()
export class RankingsService {
    private readonly logger = new Logger(RankingsService.name)

    constructor(
        @InjectModel("Ranking") private readonly rankingModel: Model<Ranking>,
        private readonly clientProxyProvider: ClientProxyProvider
    ) {}

    async processMatch(match_id: string, match: Match): Promise<void> {
        try {
            const category = (await firstValueFrom(
                this.clientProxyProvider.adminBackend.send(
                    "find-category-by-id",
                    match.category_id
                )
            )) as Category

            await Promise.all(
                match.players.map(async player => {
                    const ranking: any = {
                        category_id: match.category_id,
                        challenge_id: match.challenge,
                        player_id: player,
                        match_id
                    }

                    if (player === match.winner) {
                        const event = category.events.find(
                            ev => ev.name === EventName.VICTORY
                        )

                        ;(ranking.event = EventName.VICTORY),
                            (ranking.score = event.value),
                            (ranking.operation = event.operation)
                    } else {
                        const event = category.events.find(
                            ev => ev.name === EventName.DEFEAT
                        )

                        ;(ranking.event = EventName.DEFEAT),
                            (ranking.score = event.value),
                            (ranking.operation = event.operation)
                    }

                    await new this.rankingModel(ranking).save()
                })
            )
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }
}
