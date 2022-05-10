import { sign } from 'jsonwebtoken';

export type JwtPayload = {
  publicAddress: string;
  expirationDate: Date;
  jti: string;
};

export const generateJwt = (payload: JwtPayload): string => {
  const jwt = sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: `${payload.expirationDate.valueOf()}s`,
  });
  return jwt;
};
