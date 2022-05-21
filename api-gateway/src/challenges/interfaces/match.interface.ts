import { Player } from "src/players/interfaces/player.interface"
import { Result } from "./result.interface"

export interface Match {
    category_id?: string
    challenge?: string
    players?: Player[]
    winner?: Player
    result?: Result[]
}
