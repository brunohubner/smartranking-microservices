import { Logger } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { MicroserviceOptions, Transport } from "@nestjs/microservices"
import { AppModule } from "./app.module"
import { env } from "./config/env"

const logger = new Logger("Main")

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.RMQ,
            options: {
                urls: [env.RABBITMQ_URL_CONNECTION],
                queue: "admin-backend"
            }
        }
    )
    await app
        .listen()
        .then(() => logger.log("Microservice Admin Backend is listening"))
}
bootstrap()
