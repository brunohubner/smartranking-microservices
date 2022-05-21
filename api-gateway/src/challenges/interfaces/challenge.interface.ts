import { Player } from "src/players/interfaces/player.interface"
import { ChallengeStatus } from "./challenge-status.enum"
import { Match } from "./match.interface"

export interface Challenge {
    dateTimeChallenge: Date
    status: ChallengeStatus
    dateTimeRequest: Date
    dateTimeResponse: Date
    challenger: Player
    category_id: string
    players: Player[]
    match?: Match
}
