import { Document } from "mongoose"
import { Event } from "./event.interface"

export interface Category extends Document {
    readonly name: string
    description: string
    events: Event[]
}
