import { HandlebarsParserTemplate } from "./interfaces/handlebars-parser-template.interface"
import handlebars from "handlebars"
import * as fs from "fs"
import { Injectable } from "@nestjs/common"

@Injectable()
export class HandlebarsParserProvider {
    async parse({
        filePath,
        variables
    }: HandlebarsParserTemplate): Promise<string> {
        const templateFileContent = await fs.promises.readFile(filePath, {
            encoding: "utf-8"
        })
        const parseTemplate = handlebars.compile(templateFileContent)
        return parseTemplate(variables)
    }
}
