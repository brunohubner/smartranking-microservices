import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UsePipes,
    ValidationPipe
} from "@nestjs/common"
import { Observable, firstValueFrom } from "rxjs"
import { validateEmail } from "src/common/helpers/validateEmail"
import { ClientProxyProvider } from "src/proxyrmq/client-proxy.provider"
import { CreatePlayerDto } from "./dtos/create-player.dto"
import { UpdatePlayerDto } from "./dtos/update-player.dto"

@Controller("api/v1/players")
export class PlayersController {
    constructor(private readonly clientProxyProvider: ClientProxyProvider) {}

    @Post()
    @UsePipes(ValidationPipe)
    async create(@Body() createPlayerDto: CreatePlayerDto): Promise<any> {
        const _id = createPlayerDto.category_id
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
        return this.clientProxyProvider.adminBackend.send(
            "create-player",
            createPlayerDto
        )
    }

    @Get()
    @UsePipes(ValidationPipe)
    findAll(): Observable<any[]> {
        return this.clientProxyProvider.adminBackend.send(
            "find-all-players",
            ""
        )
    }

    @Get(":param")
    @UsePipes(ValidationPipe)
    findOne(@Param("param") param: string): Observable<any> {
        if (validateEmail(param)) {
            const _id = param
            return this.clientProxyProvider.adminBackend.send(
                "find-player-by-email",
                _id
            )
        }
        const email = param
        return this.clientProxyProvider.adminBackend.send(
            "find-player-by-id",
            email
        )
    }

    @Patch(":_id")
    @UsePipes(ValidationPipe)
    async update(
        @Param("_id") _id: string,
        @Body() updatePlayerDto: UpdatePlayerDto
    ): Promise<any> {
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
        return this.clientProxyProvider.adminBackend.send("update-player", {
            _id,
            player: updatePlayerDto
        })
    }

    @Delete(":_id")
    remove(@Param("_id") _id: string): Observable<any> {
        return this.clientProxyProvider.adminBackend.send("delete-player", _id)
    }
}
