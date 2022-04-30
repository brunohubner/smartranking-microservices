import { Document } from "mongoose"

export interface Player extends Document {
    phoneNumber: string
    email: string
    name: string
    ranking: string
    rankingPosition: number
    urlAvatarPlayer: string
    category_id: string
}
