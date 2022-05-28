import { Injectable } from "@nestjs/common"
import { env } from "src/common/config/env"
import sgMail from "@sendgrid/mail"
import { SendMailData } from "./interfaces/send-mail-data.interface"
import { HandlebarsParser } from "src/handlebars/handlebars-parser"

@Injectable()
export class MailProvider {
    constructor(private readonly handlebarsParser: HandlebarsParser) {}

    async sendMail({
        from,
        to,
        replyTo,
        subject,
        templateData,
    }: SendMailData): Promise<void> {
        try {
            sgMail.setApiKey(env.SENDGRID_API_KEY)

            await sgMail.send({
                from: `${from.name} <${env.SENDGRID_EMAIL}>`,
                to: to.email,
                replyTo,
                subject,
                html: await this.handlebarsParser.parse(templateData)
            })
        } catch (error) {
            throw new Error("SendGrid error:\n" + error)
        }
    }
}
