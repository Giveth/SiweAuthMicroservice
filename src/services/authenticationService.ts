import moment from 'moment';
import { SiweMessage } from 'siwe';
import { AccessToken } from '../entities/accessToken';
import { generateRandomString } from '../utils/utils';
import { generateJwt } from './jwtService';

export const generateAccessToken = async (
  serviceLabel: string,
  fields: SiweMessage,
): Promise<AccessToken> => {
  const jti = `${new Date().getTime()}-${generateRandomString(5)}`;

  const expirationDate = moment().add(1, 'hour');

  // add unique secrets per service ****
  const jwt = generateJwt({
    publicAddress: fields.address,
    expirationDate: expirationDate.toDate(),
    jti: jti,
  });

  return AccessToken.create({
    jwt: jwt,
    jti: jti,
    publicAddress: fields.address,
    issuer: process.env.ISSUER_ID,
    expirationDate: expirationDate,
  }).save();
};
