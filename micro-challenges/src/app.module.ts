import { Module } from "@nestjs/common"
import { ChallengesModule } from "./challenges/challenges.module"
import { MatchesModule } from "./matches/matches.module"
import { MongooseModule } from "@nestjs/mongoose"
import { env } from "./common/config/env"
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: () => ({ uri: env.DATABASE_URL })
        }),
        ChallengesModule,
        MatchesModule,
        ProxyRMQModule
    ]
})
export class AppModule {}
