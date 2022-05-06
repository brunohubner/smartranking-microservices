import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';
import { ChallengesModule } from './challenges/challenges.module';
import { MatchesModule } from './matches/matches.module';

@Module({
    imports: [ProxyrmqModule, ChallengesModule, MatchesModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
