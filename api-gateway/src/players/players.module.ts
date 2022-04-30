import { Module } from "@nestjs/common"
import { ClientProxyProvider } from "src/common/providers/client-proxy.provider"
import { PlayersController } from "./players.controller"

@Module({
    controllers: [PlayersController],
    providers: [ClientProxyProvider]
})
export class PlayersModule {}
