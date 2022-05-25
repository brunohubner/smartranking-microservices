import { Document } from "mongoose"
import { Result } from "./result.interface"

export interface Match extends Document {
    category_id: string
    challenge: string
    players: string[]
    winner?: string
    result: Result[]
}
