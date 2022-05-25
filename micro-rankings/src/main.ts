import { Logger } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { MicroserviceOptions, Transport } from "@nestjs/microservices"
import { AppModule } from "./app.module"
import { env } from "./common/config/env"
import * as momentTimezone from "moment-timezone"

const logger = new Logger("Main")

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.RMQ,
            options: {
                urls: [env.RABBITMQ_URL_CONNECTION],
                noAck: false,
                queue: "rankings"
            }
        }
    )

    Date.prototype.toJSON = function (): any {
        return momentTimezone(this)
            .tz("America/Sao_Paulo")
            .format("YYYY-MM-DD HH:mm:ss.SSS")
    }

    await app
        .listen()
        .then(() => logger.log('Microservice "rankings" is listening...'))
}
bootstrap()
