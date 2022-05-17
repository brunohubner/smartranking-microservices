import { Document } from "mongoose"
import { Category } from "src/categories/interfaces/category.interface"

export interface Player extends Document {
    readonly phoneNumber: string
    readonly email: string
    name: string
    ranking: string
    rankingPosition: number
    urlAvatarPlayer: string
    category_id: Category
}
