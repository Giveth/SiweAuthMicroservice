import { sign } from 'jsonwebtoken';

export type JwtPayload = {
  serviceJwtSecret: string;
  publicAddress: string;
  expirationDate: Date;
  givethServiceLabel: string;
  jti: string;
};

export const generateJwt = (payload: JwtPayload): string => {
  const jwt = sign(payload, payload.serviceJwtSecret as string, {
    expiresIn: `${payload.expirationDate.valueOf()}s`,
  });
  return jwt;
};
