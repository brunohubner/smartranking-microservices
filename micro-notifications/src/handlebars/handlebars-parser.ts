import { Injectable } from "@nestjs/common"
import { HandlebarsParserTemplate } from "./interfaces/handlebars-parser-template.interface"
import handlebars from "handlebars"
import fs from "fs"

@Injectable()
export class HandlebarsParser {
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
