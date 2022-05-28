import { Module } from "@nestjs/common"
import { ProxyRMQModule } from "./proxyrmq/proxyrmq.module"
import { NotificationsModule } from "./notifications/notifications.module"
import { MailModule } from "./mail/mail.module"
import { HandlebarsParserModule } from "./handlebars/handlebars.module"
import { HandlebarsParser } from "./handlebars/handlebars-parser"

@Module({
    imports: [
        ProxyRMQModule,
        NotificationsModule,
        MailModule,
        HandlebarsParser,
        HandlebarsParserModule,
    ],
})
export class AppModule {}
