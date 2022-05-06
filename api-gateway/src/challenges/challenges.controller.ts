import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
    UsePipes,
    ValidationPipe
} from "@nestjs/common"
import { firstValueFrom } from "rxjs"
import { ClientProxyProvider } from "src/proxyrmq/client-proxy.provider"
import { AddChallengeToMatchDto } from "./dtos/add-challenge-to-match.dto"
import { CreateChallengeDto } from "./dtos/create-challenge.dto"
import { UpdateChallengeDto } from "./dtos/update-challenge.dto"
import { ChallengeStatus } from "./interfaces/challenge-status.enum"
import { Challenge } from "./interfaces/challenge.interface"

@Controller("challenges")
export class ChallengesController {
    constructor(private readonly clientProxyProvider: ClientProxyProvider) {}

    @Post()
    @UsePipes(ValidationPipe)
    async create(@Body() createChallengeDto: CreateChallengeDto): Promise<any> {
        if (createChallengeDto.players[0] == createChallengeDto.players[1]) {
            throw new BadRequestException(
                "Inform players different from each other."
            )
        }

        const challengerIsAPlayer = createChallengeDto.players.find(
            player => player === createChallengeDto.challenger
        )
        if (!challengerIsAPlayer) {
            throw new BadRequestException(
                "Challenger must be a challenge player."
            )
        }

        createChallengeDto.players.forEach(player => {
            if (player !== createChallengeDto.category_id) {
                throw new BadRequestException(
                    `The player with ID ${player} does not belong to the category with ID ${createChallengeDto.category_id}`
                )
            }
        })

        const [player1, player2] = await firstValueFrom(
            this.clientProxyProvider.adminBackend.send("find-many-players", [
                createChallengeDto.players[0],
                createChallengeDto.players[1]
            ])
        )
        if (!player1) {
            throw new NotFoundException(
                `The player with ID ${createChallengeDto.players[0]} does not exists.`
            )
        }
        if (!player2) {
            throw new NotFoundException(
                `The player with ID ${createChallengeDto.players[1]} does not exists.`
            )
        }

        const challenge = {
            ...createChallengeDto,
            dateTimeRequest: new Date(),
            status: ChallengeStatus.PENDING
        }
        return this.clientProxyProvider.challenges.send(
            "create-challenge",
            challenge
        )
    }

    @Get()
    @UsePipes(ValidationPipe)
    async find(@Query("player_id") player_id: string): Promise<any> {
        if (player_id) {
            const playerExists = await firstValueFrom(
                this.clientProxyProvider.adminBackend.send(
                    "find-player-by-id",
                    player_id
                )
            )
            if (!playerExists) {
                throw new NotFoundException(
                    `The player with ID ${player_id} does not exists.`
                )
            }
            return this.clientProxyProvider.challenges.send(
                "find-all-challenges-of-a-player",
                player_id
            )
        }
        return this.clientProxyProvider.challenges.send(
            "find-all-challenges",
            ""
        )
    }

    @Patch(":_id")
    @UsePipes(ValidationPipe)
    async update(
        @Param("_id") _id: string,
        @Body() updateChallengeDto: UpdateChallengeDto
    ): Promise<any> {
        const challenge = (await firstValueFrom(
            this.clientProxyProvider.challenges.send(
                "find-challenge-by-id",
                _id
            )
        )) as Challenge

        if (!challenge) {
            throw new NotFoundException(
                `The challenge with ID ${_id} do not exists.`
            )
        }
        if (
            updateChallengeDto.status &&
            challenge.status !== ChallengeStatus.PENDING
        ) {
            throw new BadRequestException("Challenge already finished.")
        }
        return this.clientProxyProvider.challenges.send(
            "update-challenge",
            updateChallengeDto
        )
    }

    @Delete(":_id")
    @UsePipes(ValidationPipe)
    async remove(@Param("_id") _id: string): Promise<any> {
        const challenge = (await firstValueFrom(
            this.clientProxyProvider.challenges.send(
                "find-challenge-by-id",
                _id
            )
        )) as Challenge

        if (!challenge) {
            throw new NotFoundException(
                `The challenge with ID ${_id} do not exists.`
            )
        }
        return this.clientProxyProvider.challenges.send("delete-challenge", "")
    }

    @Post(":challenge_id/match")
    @UsePipes(ValidationPipe)
    async addChallengeToMatch(
        @Param("challenge_id") challenge_id: string,
        @Body() addChallengeToMatchDto: AddChallengeToMatchDto
    ): Promise<any> {
        const challenge = (await firstValueFrom(
            this.clientProxyProvider.challenges.send(
                "find-challenge-by-id",
                challenge_id
            )
        )) as Challenge

        if (!challenge) {
            throw new NotFoundException(
                `The challenge with ID ${challenge_id} do not exists.`
            )
        }

        if (challenge.status === ChallengeStatus.ACCOMPLISHED) {
            throw new BadRequestException(
                "You cannot update a challenge that has already been completed."
            )
        }

        if (challenge.status !== ChallengeStatus.ACCEPTED) {
            throw new BadRequestException(
                "Only accepted challenges can receive a match."
            )
        }

        const winnerIsAPlayer = challenge.players.find(
            player => player._id === addChallengeToMatchDto.winner
        )
        if (!winnerIsAPlayer) {
            throw new BadRequestException(
                "The winner is not part of the challenge."
            )
        }

        return this.clientProxyProvider.challenges.send(
            "add-challenge-to-match",
            addChallengeToMatchDto
        )
    }
}
