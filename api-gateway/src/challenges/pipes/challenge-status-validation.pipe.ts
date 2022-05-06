import { BadRequestException, PipeTransform } from "@nestjs/common"
import { ChallengeStatus } from "../interfaces/challenge-status.enum"

export class ChallengeStatusValidationPipe implements PipeTransform {
    private readonly allowedStatus = [
        ChallengeStatus.ACCEPTED,
        ChallengeStatus.DENIED,
        ChallengeStatus.CALLED_OFF
    ]

    transform(value: any) {
        const status = value?.status?.toUpperCase() || ""
        if (!this.validateStatus(status)) {
            throw new BadRequestException(`${status} is a inválid status.`)
        }
        return value
    }

    private validateStatus(status: any): boolean {
        const index = this.allowedStatus.indexOf(status)
        return index >= 0
    }
}
