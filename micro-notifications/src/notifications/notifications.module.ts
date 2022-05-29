import { Module } from "@nestjs/common"
import { MailModule } from "src/mail/mail.module"
import { ProxyRMQModule } from "src/proxyrmq/proxyrmq.module"
import { NotificationsController } from "./notifications.controller"
import { NotificationsService } from "./notifications.service"

@Module({
    controllers: [NotificationsController],
    providers: [NotificationsService],
    imports: [MailModule, ProxyRMQModule]
})
export class NotificationsModule {}
