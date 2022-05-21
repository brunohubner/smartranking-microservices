import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ChallengesModule } from "src/challenges/challenges.module"
import { MatchSchema } from "./interfaces/match.schema"
import { MatchesController } from "./matches.controller"
import { MatchesService } from "./matches.service"

@Module({
    imports: [
        MongooseModule.forFeature([{ name: "Match", schema: MatchSchema }]),
		ChallengesModule
    ],
    controllers: [MatchesController],
    providers: [MatchesService]
})
export class MatchesModule {}
