import { Module } from "@nestjs/common"
import { HandlebarsParserProvider } from "./handlebars-parser.provider"

@Module({
    providers: [HandlebarsParserProvider],
    exports: [HandlebarsParserProvider]
})
export class HandlebarsParserModule {}
