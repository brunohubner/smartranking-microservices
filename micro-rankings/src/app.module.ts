import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { env } from "./common/config/env"
import { RankingsModule } from "./rankings/rankings.module"
import { ProxyRMQModule } from "./proxyrmq/proxyrmq.module"

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: () => ({ uri: env.DATABASE_URL })
        }),
        RankingsModule,
        ProxyRMQModule
    ]
})
export class AppModule {}
