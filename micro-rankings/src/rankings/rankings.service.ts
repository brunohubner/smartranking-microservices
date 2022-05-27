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
import * as momentTimezone from "moment-timezone"
import { Challenge } from "./interfaces/challenge.interface"
import * as _ from "lodash"
import { RankingResponse } from "./interfaces/ranking-response.interface"

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

    async findByCategoryId(
        category_id: string,
        date: string
    ): Promise<RankingResponse[]> {
        try {
            if (!date) {
                date = momentTimezone()
                    .tz("America/Sao_Paulo")
                    .format("YYYY-MM-DD")
            }

            const rankings = await this.rankingModel
                .find()
                .where("category_id")
                .equals(category_id)

            const challenges: Challenge[] = await firstValueFrom(
                this.clientProxyProvider.challenges.send("find-accomplished", {
                    category_id,
                    date
                })
            )

            _.remove(rankings, item => {
                return !challenges.find(
                    challenge => challenge._id === item.challenge_id.toString()
                )
            })

            const result = _(rankings)
                .groupBy("player_id")
                .map((items, index) => ({
                    player: index,
                    matchHistory: _.countBy(items, "event"),
                    score: _.sumBy(items, "score")
                }))
                .value()

            const sortedResult = _.orderBy(result, "score", "desc")

            return sortedResult.map(
                ({ player, matchHistory, score }, index) => ({
                    position: index + 1,
                    player,
                    score,
                    matchHistory: {
                        victories: matchHistory.VICTORY || 0,
                        defeats: matchHistory.DEFEAT || 0,
                        draws: matchHistory.DRAW || 0
                    }
                })
            )
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }
}
