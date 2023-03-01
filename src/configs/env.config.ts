import * as dotenv from "dotenv";
dotenv.config();
export const ENV_CONFIG = {
    JWT_SECRET: process.env.JWT_SECRET,
    MONGO_URL: process.env.MONGO_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    COOKIE_KEY_1: '123456',
    COOKIE_KEY_2: '789456'
}