import * as mongoose from "mongoose"

export const PlayerSchema = new mongoose.Schema(
    {
        phoneNumber: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        ranking: String,
        rankingPosition: Number,
        urlAvatarPlayer: String
    },
    {
        timestamps: true,
        collection: "players",
        toJSON: {
            transform(_, ret): void {
                delete ret.__v
            }
        }
    }
)
