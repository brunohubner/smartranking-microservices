import * as mongoose from "mongoose"

export const CategorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        events: [
            {
                name: { type: String, required: true },
                operation: { type: String, required: true },
                value: { type: Number, required: true }
            }
        ]
    },
    {
        timestamps: true,
        collection: "categories",
        toJSON: {
            transform(_, ret): void {
                delete ret.__v
            }
        }
    }
)
