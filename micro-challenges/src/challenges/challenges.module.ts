import { Module } from "@nestjs/common"
import { ChallengesService } from "./challenges.service"
import { ChallengesController } from "./challenges.controller"
import { MongooseModule } from "@nestjs/mongoose"
import { ChallengeSchema } from "./interfaces/chalenge.schema"
import { ProxyRMQModule } from "src/proxyrmq/proxyrmq.module"

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: "Challenge", schema: ChallengeSchema }
        ]),
        ProxyRMQModule
    ],
    providers: [ChallengesService],
    controllers: [ChallengesController],
    exports: [ChallengesService]
})
export class ChallengesModule {}
