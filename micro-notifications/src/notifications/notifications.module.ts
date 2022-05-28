import { Module } from "@nestjs/common"
import { HandlebarsParser } from "src/handlebars/handlebars-parser"
import { HandlebarsParserModule } from "src/handlebars/handlebars.module"
import { MailProvider } from "src/mail/mail.provider"
import { ClientProxyProvider } from "src/proxyrmq/client-proxy.provider"
import { NotificationsController } from "./notifications.controller"
import { NotificationsService } from "./notifications.service"

@Module({
    controllers: [NotificationsController],
    providers: [NotificationsService],
    imports: [MailProvider, ClientProxyProvider]
})
export class NotificationsModule {}
