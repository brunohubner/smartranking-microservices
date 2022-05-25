import { Result } from "./result.interface"

export interface Match {
    category_id: string
    challenge: string
    players: string[]
    winner?: string
    result: Result[]
}
