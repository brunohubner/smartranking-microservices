import "dotenv/config"

export const env = {
    PORT: process.env.PORT || 3333,
    RABBITMQ_URL_CONNECTION: process.env.RABBITMQ_URL_CONNECTION || ""
}
