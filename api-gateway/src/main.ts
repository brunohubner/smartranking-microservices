import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import momentTimezone from "moment-timezone"
import { AllExceptionsFilter } from "./common/filters/http-exception.filter"
import { env } from "./common/config/env"
import { TimeoutInterceptor } from "./common/interceptors/timeout.interceptor"
import { Logger } from "@nestjs/common"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"

const logger = new Logger("Main")

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalInterceptors(new TimeoutInterceptor())
    app.useGlobalFilters(new AllExceptionsFilter())

    Date.prototype.toJSON = function (): any {
        return momentTimezone(this)
            .tz("America/Sao_Paulo")
            .format("YYYY-MM-DD HH:mm:ss.SSS")
    }

    const swaggerConfig = new DocumentBuilder()
        .setTitle("Smart Ranking API Gateway")
        .setDescription("The api for football players challengers.")
        .setVersion("2.0.0")
        .addTag("dev")
        .build()
    const document = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup("/", app, document)

    await app
        .listen(env.PORT)
        .then(() =>
            logger.log(`API Gateway listening at http://localhost:${env.PORT}`)
        )
}
bootstrap()
