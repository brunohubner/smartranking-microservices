import * as mongoose from "mongoose"
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose"
import { EventName } from "./event-name.enum"

@Schema({
    timestamps: true,
    collection: "rankings",
    toJSON: {
        transform(_, ret): void {
            delete ret.__v
        }
    }
})
export class Ranking extends mongoose.Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    challenge_id: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    player_id: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    match_id: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    category_id: string

    @Prop({
        type: String,
        enum: [EventName.VICTORY, EventName.DRAW, EventName.DEFEAT],
        required: true
    })
    event: EventName

    @Prop({ type: String, required: true })
    operation: string

    @Prop({ type: Number, required: true })
    score: number
}

export const RankingSchema = SchemaFactory.createForClass(Ranking)
