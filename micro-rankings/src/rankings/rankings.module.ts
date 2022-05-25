import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ProxyRMQModule } from "src/proxyrmq/proxyrmq.module"
import { RankingSchema } from "./interfaces/rankings.schema"
import { RankingsController } from "./rankings.controller"
import { RankingsService } from "./rankings.service"

@Module({
    imports: [
        MongooseModule.forFeature([{ name: "Ranking", schema: RankingSchema }]),
        ProxyRMQModule
    ],
    controllers: [RankingsController],
    providers: [RankingsService]
})
export class RankingsModule {}
