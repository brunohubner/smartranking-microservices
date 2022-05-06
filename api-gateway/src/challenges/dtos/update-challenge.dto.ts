import { IsOptional } from "class-validator"
import { ChallengeStatus } from "../interfaces/challenge-status.enum"
import { ApiProperty } from "@nestjs/swagger"

export class UpdateChallengeDto {
    @ApiProperty()
    @IsOptional()
    dateTimeChallenge?: Date

    @ApiProperty()
    @IsOptional()
    status?: ChallengeStatus
}
