import { HandlebarsParserTemplate } from "src/handlebars/interfaces/handlebars-parser-template.interface"
import { MailContact } from "./mail-contact.inteface"

export interface SendMailData {
    from: MailContact
    to: MailContact
    replyTo: string
    subject: string
    templateData: HandlebarsParserTemplate
}
