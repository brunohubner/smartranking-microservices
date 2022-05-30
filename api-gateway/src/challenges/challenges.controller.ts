import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UsePipes,
    ValidationPipe
} from "@nestjs/common"
import { ChallengesService } from "./challenges.service"
import { AddMatchToChallengeDto } from "./dtos/add-match-to-challenge.dto"
import { CreateChallengeDto } from "./dtos/create-challenge.dto"
import { UpdateChallengeDto } from "./dtos/update-challenge.dto"
import { ChallengeStatusValidationPipe } from "./pipes/challenge-status-validation.pipe"

@Controller("api/v1/challenges")
export class ChallengesController {
    constructor(private readonly challengesService: ChallengesService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async create(
        @Body() createChallengeDto: CreateChallengeDto
    ): Promise<void> {
        return this.challengesService.create(createChallengeDto)
    }

    @Get()
    @UsePipes(ValidationPipe)
    async find(
        @Query("player_id") player_id: string,
        @Query("challenge_id") challenge_id: string
    ): Promise<any> {
        return this.challengesService.find(player_id, challenge_id)
    }

    @Patch(":_id")
    @UsePipes(ValidationPipe)
    async update(
        @Param("_id") _id: string,
        @Body(ChallengeStatusValidationPipe)
        updateChallengeDto: UpdateChallengeDto
    ): Promise<void> {
        return this.challengesService.update(_id, updateChallengeDto)
    }

    @Delete(":_id")
    @UsePipes(ValidationPipe)
    async remove(@Param("_id") _id: string): Promise<void> {
        return this.challengesService.remove(_id)
    }

    @Post(":challenge_id/match")
    @UsePipes(ValidationPipe)
    async addMatchToChallenge(
        @Param("challenge_id") challenge_id: string,
        @Body() addMatchToChallengeDto: AddMatchToChallengeDto
    ): Promise<void> {
        return this.addMatchToChallenge(challenge_id, addMatchToChallengeDto)
    }
}
