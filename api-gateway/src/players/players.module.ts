import { Module } from "@nestjs/common"
import { ProxyRMQModule } from "src/proxyrmq/proxyrmq.module"
import { PlayersController } from "./players.controller"
import { PlayersService } from "./players.service"

@Module({
    imports: [ProxyRMQModule],
    controllers: [PlayersController],
    providers: [PlayersService]
})
export class PlayersModule {}
