import { Injectable } from "@nestjs/common"
import {
    ClientProxy,
    ClientProxyFactory,
    Transport
} from "@nestjs/microservices"
import { env } from "src/common/config/env"

@Injectable()
export class ClientProxyProvider {
    readonly rankings: ClientProxy
    readonly notifications: ClientProxy

    constructor() {
        this.rankings = this.createProxyConnection("rankings")
        this.notifications = this.createProxyConnection("notifications")
    }

    private createProxyConnection(queueName: string): ClientProxy {
        return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [env.RABBITMQ_URL_CONNECTION],
                queue: queueName
            }
        })
    }
}
