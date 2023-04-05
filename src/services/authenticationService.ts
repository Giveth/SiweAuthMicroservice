import moment from 'moment';
import { AccessToken } from '../entities/accessToken';
import { generateRandomString } from '../utils/utils';
import { generateJwt, JwtPayload } from './jwtService';

interface AccessTokenFields {
  address: string;
}

export const generateAccessToken = async (
  fields: AccessTokenFields,
  isPassport = false,
): Promise<AccessToken> => {
  const jti = `${new Date().getTime()}-${generateRandomString(5)}`;

  const expirationDate = moment().add(30, 'days');

  const jwtPayload: JwtPayload = {
    publicAddress: fields.address,
    expirationDate: expirationDate.toDate(),
    jti: jti,
  };
  if (isPassport) {
    jwtPayload['isPassport'] = true;
  }
  // add unique secrets per service ****
  const jwt = generateJwt(jwtPayload);

  return AccessToken.create({
    jwt: jwt,
    jti: jti,
    publicAddress: fields.address,
    expirationDate: expirationDate,
  }).save();
};
