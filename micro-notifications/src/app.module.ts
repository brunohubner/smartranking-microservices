import { Module } from "@nestjs/common"
import { ProxyRMQModule } from "./proxyrmq/proxyrmq.module"
import { NotificationsModule } from "./notifications/notifications.module"
import { MailModule } from "./mail/mail.module"
import { HandlebarsParserModule } from "./handlebars/handlebars.module"

@Module({
    imports: [
        ProxyRMQModule,
        NotificationsModule,
        MailModule,
        HandlebarsParserModule
    ]
})
export class AppModule {}
