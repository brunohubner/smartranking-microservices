import { Injectable } from "@nestjs/common"
import {
    ClientProxy,
    ClientProxyFactory,
    Transport
} from "@nestjs/microservices"
import { env } from "process"

@Injectable()
export class ClientProxyProvider {
    readonly adminBackend: ClientProxy

    constructor() {
        this.adminBackend = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [env.RABBITMQ_URL_CONNECTION],
                queue: "admin-backend"
            }
        })
    }
}
