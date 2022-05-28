import "dotenv/config"

export const env = Object.freeze({
    RABBITMQ_URL_CONNECTION: process.env.RABBITMQ_URL_CONNECTION || "",
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || "",
    SENDGRID_EMAIL: process.env.SENDGRID_EMAIL || ""
})
