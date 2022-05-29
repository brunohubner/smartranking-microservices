import { Module } from "@nestjs/common"
import { HandlebarsParserModule } from "src/handlebars/handlebars.module"
import { MailProvider } from "./mail.provider"

@Module({
    providers: [MailProvider],
    exports: [MailProvider],
    imports: [HandlebarsParserModule]
})
export class MailModule {}
