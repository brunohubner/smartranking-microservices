import "dotenv/config"

export const env = {
    RABBITMQ_URL_CONNECTION: process.env.RABBITMQ_URL_CONNECTION || "",
    DATABASE_URL: process.env.DATABASE_URL || ""
}
