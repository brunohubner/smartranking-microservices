import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import momentTimezone from "moment-timezone"
import { AllExceptionsFilter } from "./common/filters/http-exception.filter"
import { env } from "./common/config/env"
import { TimeoutInterceptor } from "./common/interceptors/timeout.interceptor"
import { Logger } from "@nestjs/common"

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

    await app
        .listen(env.PORT)
        .then(() => logger.log('"api-gateway" is listening...'))
}
bootstrap()
