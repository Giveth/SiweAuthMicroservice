import { sign, verify } from 'jsonwebtoken';
import moment from 'moment';
import { findAccessTokenByUniqueIdentifiers } from '../repositories/accessTokenRepository';
import { StandardError } from '../types/StandardError';
import { errorMessagesEnum } from '../utils/errorMessages';

export type JwtPayload = {
  publicAddress: string;
  expirationDate: Date;
  jti: string;
  isPassport?: boolean;
};

export const validateJwt = async (jwt: string) => {
  const verifiedJwt = verify(jwt, process.env.JWT_SECRET as string) as any;

  const dbAccessToken = await findAccessTokenByUniqueIdentifiers(
    jwt,
    verifiedJwt.jti,
  );

  if (!dbAccessToken || dbAccessToken.didExpire())
    throw new StandardError(errorMessagesEnum.JWT_NOT_FOUND);

  return verifiedJwt;
};

export const generateJwt = (payload: JwtPayload): string => {
  const lifeTimeInMilliSeconds =
    payload.expirationDate.valueOf() - moment().valueOf();
  const jwt = sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: `${lifeTimeInMilliSeconds}`,
  });
  return jwt;
};
