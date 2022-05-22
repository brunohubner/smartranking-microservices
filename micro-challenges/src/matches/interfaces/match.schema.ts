import * as mongoose from "mongoose"

export const MatchSchema = new mongoose.Schema(
    {
        category_id: { type: String, required: true },
        challenge: { type: String, required: true },
        players: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            }
        ],
        winner: {
            type: mongoose.Schema.Types.ObjectId
        },
        result: [
            {
                set: { type: String, required: true }
            }
        ]
    },
    {
        timestamps: true,
        collection: "matches",
        toJSON: {
            transform(_, ret): void {
                delete ret.__v
            }
        }
    }
)
