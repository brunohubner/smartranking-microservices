import { Module } from "@nestjs/common"
import { HandlebarsParser } from "./handlebars-parser"

@Module({
    providers: [HandlebarsParser],
    exports: [HandlebarsParser]
})
export class HandlebarsParserModule {}
