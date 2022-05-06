import { Injectable } from "@nestjs/common"
import {
    ClientProxy,
    ClientProxyFactory,
    Transport
} from "@nestjs/microservices"
import { env } from "src/common/config/env"

@Injectable()
export class ClientProxyProvider {
    readonly adminBackend: ClientProxy
    readonly challenges: ClientProxy

    constructor() {
        this.adminBackend = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [env.RABBITMQ_URL_CONNECTION],
                queue: "admin-backend"
            }
        })

        this.challenges = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [env.RABBITMQ_URL_CONNECTION],
                queue: "challenges"
            }
        })
    }
}
