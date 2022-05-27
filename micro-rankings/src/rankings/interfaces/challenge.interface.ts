import { ChallengeStatus } from "./challenge-status.enum"

export interface Challenge {
    readonly _id: string
    dateTimeChallenge: Date
    status: ChallengeStatus
    dateTimeRequest: Date
    dateTimeResponse?: Date
    challenger: string
    category_id: string
    players: string[]
    match?: string
}
