import { Event } from "./event.interface"

export interface Category {
    readonly _id: string
    readonly name: string
    description: string
    events: Event[]
}
