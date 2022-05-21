import * as mongoose from "mongoose"

export const ChallengeSchema = new mongoose.Schema(
    {
        dateTimeChallenge: { type: Date, required: true },
        status: { type: String, required: true },
        dateTimeRequest: { type: Date, required: true },
        dateTimeResponse: Date,
        challenger: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        players: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            }
        ],
        match: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }]
    },
    {
        timestamps: true,
        collection: "challenges",
        toJSON: {
            transform(_, ret): void {
                delete ret.__v
            }
        }
    }
)
