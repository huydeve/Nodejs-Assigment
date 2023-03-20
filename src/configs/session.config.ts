import session from 'express-session';

export interface MySessionData {
    accessToken: string;
    refreshToken: string;
    jwtToken: string;
    [key: string]: any; // Allows any other properties to be added
}
export interface UserToken {
    accessToken: string;
    refreshToken: string;
    jwtToken: string;
}
declare module 'express-session' {
    interface SessionData {
        user?: any;
        passport?: any;
        myData: MySessionData;
        resetPassword: {
            verifyOtp: boolean;
            strategyValue: string;
        },
        isVerify: boolean;
        tokenVerify: string
    }
}