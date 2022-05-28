import { Module } from "@nestjs/common"
import { HandlebarsParser } from "src/handlebars/handlebars-parser"
import { MailProvider } from "./mail.provider"

@Module({
    providers: [MailProvider],
    exports: [MailProvider],
    imports: [HandlebarsParser]
})
export class MailModule {}
