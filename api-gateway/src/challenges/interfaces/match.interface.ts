import { Player } from "src/players/interfaces/player.interface"
import { Result } from "./result.interface"

export interface Match extends Document {
    _id: string
    category: string
    players: Player[]
    winner: Player
    result: Result[]
}
