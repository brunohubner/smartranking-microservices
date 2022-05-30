import {
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
import { CreatePlayerDto } from "./dtos/create-player.dto"
import { UpdatePlayerDto } from "./dtos/update-player.dto"
import { PlayersService } from "./players.service"

@Controller("api/v1/players")
export class PlayersController {
    constructor(private readonly playersService: PlayersService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async create(@Body() createPlayerDto: CreatePlayerDto): Promise<void> {
        return this.playersService.create(createPlayerDto)
    }

    @Get()
    @UsePipes(ValidationPipe)
    findAll(): Promise<any[]> {
        return this.playersService.findAll()
    }

    @Get(":param")
    @UsePipes(ValidationPipe)
    findOne(@Param("param") param: string): Promise<any> {
        return this.playersService.findOne(param)
    }

    @Patch(":_id")
    @UsePipes(ValidationPipe)
    async update(
        @Param("_id") _id: string,
        @Body() updatePlayerDto: UpdatePlayerDto
    ): Promise<void> {
        return this.playersService.update(_id, updatePlayerDto)
    }

    @Delete(":_id")
    async remove(@Param("_id") _id: string): Promise<void> {
        return this.playersService.remove(_id)
    }
}
