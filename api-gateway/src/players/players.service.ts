import { BadRequestException, Injectable } from "@nestjs/common"
import { firstValueFrom } from "rxjs"
import { validateEmail } from "src/common/helpers/validateEmail"
import { ClientProxyProvider } from "src/proxyrmq/client-proxy.provider"
import { CreatePlayerDto } from "./dtos/create-player.dto"
import { UpdatePlayerDto } from "./dtos/update-player.dto"

@Injectable()
export class PlayersService {
    constructor(private readonly clientProxyProvider: ClientProxyProvider) {}

    async create(createPlayerDto: CreatePlayerDto): Promise<void> {
        const [category, player] = await Promise.all([
            firstValueFrom(
                this.clientProxyProvider.adminBackend.send(
                    "find-category-by-id",
                    createPlayerDto.category_id
                )
            ),
            firstValueFrom(
                this.clientProxyProvider.adminBackend.send(
                    "find-player-by-email-or-phone-number",
                    createPlayerDto
                )
            )
        ])

        if (!category) {
            throw new BadRequestException(
                `The category with ID ${createPlayerDto.category_id} does not exists.`
            )
        }

        if (player) {
            for (const [key, value] of Object.entries(createPlayerDto)) {
                if (player?.[key] === value) {
                    throw new BadRequestException(
                        `This player with ${key} ${value} already exists.`
                    )
                }
            }
            throw new BadRequestException(`Player already registered.`)
        }

        return firstValueFrom(
            this.clientProxyProvider.adminBackend.emit(
                "create-player",
                createPlayerDto
            )
        )
    }

    async findAll(): Promise<any[]> {
        return firstValueFrom(
            this.clientProxyProvider.adminBackend.send("find-all-players", "")
        )
    }

    async findOne(param: string): Promise<any> {
        if (validateEmail(param)) {
            return this.clientProxyProvider.adminBackend.send(
                "find-player-by-email",
                param
            )
        }
        return firstValueFrom(
            this.clientProxyProvider.adminBackend.send(
                "find-player-by-id",
                param
            )
        )
    }

    async update(_id: string, updatePlayerDto: UpdatePlayerDto): Promise<void> {
        if (updatePlayerDto.category_id) {
            const _id = updatePlayerDto.category_id
            const category = await firstValueFrom(
                this.clientProxyProvider.adminBackend.send(
                    "find-category-by-id",
                    _id
                )
            )
            if (!category) {
                throw new BadRequestException(
                    `The category with ID ${_id} does not exists.`
                )
            }
        }
        return firstValueFrom(
            this.clientProxyProvider.adminBackend.emit("update-player", {
                _id,
                player: {
                    name: updatePlayerDto?.name,
                    urlAvatarPlayer: updatePlayerDto?.urlAvatarPlayer,
                    category_id: updatePlayerDto?.category_id
                }
            })
        )
    }

    async remove(_id: string): Promise<any> {
        const player = await firstValueFrom(
            this.clientProxyProvider.adminBackend.send("find-player-by-id", _id)
        )

        if (!player) {
            throw new BadRequestException(
                `The player with ID ${_id} does not exists.`
            )
        }

        return firstValueFrom(
            this.clientProxyProvider.adminBackend.emit("delete-player", _id)
        )
    }
}
