import { HandlebarsVariables } from "./handlebars-variables.interface"

export interface HandlebarsParserTemplate {
    filePath: string
    variables: HandlebarsVariables
}
