import moment from 'moment';
import { SiweMessage } from 'siwe';
import { AccessToken } from '../entities/accessToken';
import { GivethService } from '../entities/givethService';
import { findGivethServiceByLabel } from '../repositories/givethServiceRepository';
import { StandardError } from '../types/StandardError';
import { errorMessagesEnum } from '../utils/errorMessages';
import { generateRandomString } from '../utils/utils';
import { generateJwt } from './jwtService';

export const generateAccessToken = async (
  serviceLabel: string,
  fields: SiweMessage,
): Promise<AccessToken> => {
  // what service access being requested
  const givethService = await findGivethServiceByLabel(serviceLabel);
  if (!givethService)
    throw new StandardError(errorMessagesEnum.SERVICE_NOT_IMPLEMENTED);

  const jti = `${
    givethService.serviceLabel
  }-${new Date().getTime()}-${generateRandomString(5)}`;

  const expirationDate = moment().add(1, 'hour');

  // add unique secrets per service ****
  const jwt = generateJwt({
    serviceJwtSecret: givethService.jwtSecret,
    publicAddress: fields.address,
    expirationDate: expirationDate.toDate(),
    givethServiceLabel: givethService.serviceLabel,
    jti: jti,
  });

  return AccessToken.create({
    jwt: jwt,
    jti: jti,
    publicAddress: fields.address,
    issuer: process.env.ISSUER_ID,
    expirationDate: expirationDate,
    givethServiceId: givethService.id,
  }).save();
};
