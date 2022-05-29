import { Injectable, Logger } from "@nestjs/common"
import { RpcException } from "@nestjs/microservices"
import * as path from "path"
import { firstValueFrom } from "rxjs"
import { Challenge } from "src/interfaces/challenge.interface"
import { Player } from "src/interfaces/player.interface"
import { MailProvider } from "src/mail/mail.provider"
import { ClientProxyProvider } from "src/proxyrmq/client-proxy.provider"

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name)

    constructor(
        private readonly mailProvider: MailProvider,
        private readonly clientProxyProvider: ClientProxyProvider
    ) {}

    async sendMailToAdversary(challenge: Challenge): Promise<void> {
        try {
            const adversary_id = challenge.players.find(
                player => player !== challenge.challenger
            )

            const [challenger, adversary]: Player[] = await firstValueFrom(
                this.clientProxyProvider.adminBackend.send(
                    "find-many-players",
                    [challenge.challenger, adversary_id]
                )
            )

            const filePath = path.resolve(
                __dirname,
                "../../views/new-challenge.hbs"
            )

            await this.mailProvider.sendMail({
                from: {
                    name: challenger.name,
                    email: challenger.email
                },
                to: {
                    name: adversary.name,
                    email: adversary.email
                },
                subject: "Smart Ranking - New Challenge",
                templateData: {
                    filePath,
                    variables: {
                        challenger_name: challenger.name,
                        adversary_name: adversary.name
                    }
                }
            })
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new RpcException(error.message)
        }
    }
}
