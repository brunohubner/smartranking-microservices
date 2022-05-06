import { Player } from "src/players/interfaces/player.interface"
import { Event } from "./event.interface"

export interface Category {
    name: string
    description: string
    events: Event[]
    players: Player[]
}
