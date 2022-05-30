/* eslint-disable @typescript-eslint/no-extra-semi */
import {
    BadRequestException,
    Injectable,
    NotFoundException
} from "@nestjs/common"
import { firstValueFrom } from "rxjs"
import { Category } from "src/categories/interfaces/category.interface"
import { Player } from "src/players/interfaces/player.interface"
import { ClientProxyProvider } from "src/proxyrmq/client-proxy.provider"
import { AddMatchToChallengeDto } from "./dtos/add-match-to-challenge.dto"
import { CreateChallengeDto } from "./dtos/create-challenge.dto"
import { UpdateChallengeDto } from "./dtos/update-challenge.dto"
import { ChallengeStatus } from "./interfaces/challenge-status.enum"
import { Challenge } from "./interfaces/challenge.interface"
import { Match } from "./interfaces/match.interface"

@Injectable()
export class ChallengesService {
    constructor(private readonly clientProxyProvider: ClientProxyProvider) {}

    async create(createChallengeDto: CreateChallengeDto): Promise<void> {
        if (createChallengeDto.players[0] === createChallengeDto.players[1]) {
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

        const [player1, player2] = (await firstValueFrom(
            this.clientProxyProvider.adminBackend.send("find-many-players", [
                createChallengeDto.players[0],
                createChallengeDto.players[1]
            ])
        )) as Player[]

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

        ;[player1, player2].forEach(player => {
            if (player.category_id !== createChallengeDto.category_id) {
                throw new BadRequestException(
                    `The player with ID ${player._id} does not belong to the category with ID ${createChallengeDto.category_id}`
                )
            }
        })

        const categoryExists = (await firstValueFrom(
            this.clientProxyProvider.adminBackend.send(
                "find-category-by-id",
                createChallengeDto.category_id
            )
        )) as Category

        if (!categoryExists) {
            throw new NotFoundException(
                `The category with ID ${createChallengeDto.category_id} does not exists.`
            )
        }

        return firstValueFrom(
            this.clientProxyProvider.challenges.emit(
                "create-challenge",
                createChallengeDto
            )
        )
    }

    async find(player_id: string, challenge_id: string): Promise<any> {
        if (player_id) {
            const playerExists = (await firstValueFrom(
                this.clientProxyProvider.adminBackend.send(
                    "find-player-by-id",
                    player_id
                )
            )) as Player
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
        if (challenge_id) {
            return this.clientProxyProvider.challenges.send(
                "find-challenge-by-id",
                challenge_id
            )
        }
        return firstValueFrom(
            this.clientProxyProvider.challenges.send("find-all-challenges", "")
        )
    }

    async update(
        _id: string,
        updateChallengeDto: UpdateChallengeDto
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
        return firstValueFrom(
            this.clientProxyProvider.challenges.emit("update-challenge", {
                _id,
                challenge: updateChallengeDto
            })
        )
    }

    async remove(_id: string): Promise<any> {
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
        return firstValueFrom(
            this.clientProxyProvider.challenges.emit(
                "delete-challenge",
                challenge
            )
        )
    }

    async addMatchToChallenge(
        challenge_id: string,
        addMatchToChallengeDto: AddMatchToChallengeDto
    ): Promise<any> {
        const [challenge, winner] = await Promise.all([
            firstValueFrom(
                this.clientProxyProvider.challenges.send(
                    "find-challenge-by-id",
                    challenge_id
                )
            ) as Promise<Challenge>,
            firstValueFrom(
                this.clientProxyProvider.adminBackend.send(
                    "find-player-by-id",
                    addMatchToChallengeDto.winner
                )
            ) as Promise<Player>
        ])

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

        const winnerIsAPlayer = challenge.players.find(player => {
            const player_id = player as unknown as string
            return winner._id === player_id
        })

        if (!winnerIsAPlayer) {
            throw new BadRequestException(
                "The winner is not part of the challenge."
            )
        }

        const match: Match = {
            category_id: challenge.category_id,
            winner,
            challenge: challenge_id,
            players: challenge.players,
            result: addMatchToChallengeDto.result
        }

        return firstValueFrom(
            this.clientProxyProvider.challenges.emit("create-match", match)
        )
    }
}
