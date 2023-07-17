import { sign } from 'jsonwebtoken';
import moment from 'moment';

export type JwtPayload = {
  publicAddress: string;
  expirationDate: Date;
  jti: string;
  isPassport?: boolean;
};

export const generateJwt = (payload: JwtPayload): string => {
  const lifeTimeInMilliSeconds =
    payload.expirationDate.valueOf() - moment().valueOf();
  const jwt = sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: `${lifeTimeInMilliSeconds}`,
  });
  return jwt;
};
