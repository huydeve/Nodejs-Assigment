import * as dotenv from "dotenv";
dotenv.config();
export const ENV_CONFIG = {
    JWT_SECRET: process.env.JWT_SECRET,
    MONGO_URL: process.env.MONGO_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    COOKIE_KEY_1: '123456',
    COOKIE_KEY_2: '789456',
    EMAIL: process.env.EMAIL_BOSS,
    PASSWORD: process.env.PASSWORD,
    PHONE: process.env.PHONE,
    ACCOUNT_SID: process.env.ACCOUNT_SID,
    AUTH_TOKEN: process.env.AUTH_TOKEN,
    GOOGLE_CLIENT_PLAYGROUND: process.env.GOOGLE_CLIENT_PLAYGROUND,
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN
}