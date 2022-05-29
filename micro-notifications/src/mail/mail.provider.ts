import { env } from "src/common/config/env"
import * as sgMail from "@sendgrid/mail"
import { SendMailData } from "./interfaces/send-mail-data.interface"
import { HandlebarsParserProvider } from "../handlebars/handlebars-parser.provider"
import { Injectable } from "@nestjs/common"

@Injectable()
export class MailProvider {
    constructor(
        private readonly handlebarsParserProvider: HandlebarsParserProvider
    ) {}

    async sendMail({
        from,
        to,
        subject,
        templateData
    }: SendMailData): Promise<void> {
        try {
            sgMail.setApiKey(env.SENDGRID_API_KEY)

            await sgMail.send({
                from: `${from.name} <${env.SENDGRID_EMAIL}>`,
                to: to.email,
                subject,
                html: await this.handlebarsParserProvider.parse(templateData)
            })
        } catch (error) {
            throw new Error("SendGrid error:\n" + error)
        }
    }
}
