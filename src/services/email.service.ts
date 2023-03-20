import nodemailer from "nodemailer"
import { ENV_CONFIG } from "../configs/env.config";
import { google } from 'googleapis';



const CLIENT_ID = ENV_CONFIG.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = ENV_CONFIG.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = ENV_CONFIG.GOOGLE_CLIENT_PLAYGROUND;
const REFRESH_TOKEN = ENV_CONFIG.GOOGLE_REFRESH_TOKEN;

const myOAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);


// Set Refresh Token vào OAuth2Client Credentials
myOAuth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN
})


export async function sendToEmail(email: string, otp: string) {
    try {
        const accessToken = await myOAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'lozvai123@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: `${accessToken}`,
            },
        });

        const mailOptions = {
            from: 'Ligma <lozvai123@gmail.com>',
            to: email,
            subject: 'Verify OTP',
            html: `<h1>Your OTP: ${otp}</h1>`,
        };

        const result = await transport.sendMail(mailOptions);
        return result;
    } catch (error) {
        return error;
    }
}




