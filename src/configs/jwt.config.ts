// jwt.ts

import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/user.mongo';
import { ENV_CONFIG } from './env.config';
import { MySessionData } from './session.config';

interface DecodedJwt {
  id: string;
}
interface DecodeTokenOTP {
  otp: string;
  strategy: string;
}
const generateToken = (user: IUser): string => {
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
    yob: user.yob,
    isAdmin: user.isAdmin,

  };

  return jwt.sign(payload, ENV_CONFIG.JWT_SECRET!, { expiresIn: '1h' });
};

const verifyToken = (req: Request) => {
  const sessionData = req.session.passport;

  if (sessionData && sessionData.user) {
    if (!sessionData.user.jwtToken) {
      throw new Error('JWT token not found in session');
    }
    try {

      const decoded = jwt.verify(sessionData.user.jwtToken, ENV_CONFIG.JWT_SECRET!) as DecodedJwt;
      return decoded;
    } catch (err) {
      if (err instanceof Error)
        throw new Error(`Invalid JWT token: ${err.message}`);
    }
  }

  throw new Error(`User not login`);


};


const secretToken = (strategy: string, key: string) => {
  return jwt.sign({ strategy, key }, ENV_CONFIG.JWT_SECRET!, { expiresIn: '3m' });
}
const verifySecretToken = (token: string) => {

  try {
    const decoded = jwt.verify(token, ENV_CONFIG.JWT_SECRET!) as DecodeTokenOTP;
    return decoded;
  } catch (err) {
    if (err instanceof Error)
      throw new Error(`Invalid JWT token: ${err.message}`);
  }
}

export { generateToken, verifyToken, secretToken, verifySecretToken };
