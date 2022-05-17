import { Module } from "@nestjs/common"
import { CategoriesModule } from "./categories/categories.module"
import { PlayersModule } from "./players/players.module"
import { ChallengesModule } from "./challenges/challenges.module"
import { ProxyRMQModule } from "./proxyrmq/proxyrmq.module"
import { ClientProxyProvider } from "./proxyrmq/client-proxy.provider"

@Module({
    imports: [
        CategoriesModule,
        PlayersModule,
        ChallengesModule,
        ProxyRMQModule
    ],
    providers: [ClientProxyProvider]
})
export class AppModule {}
