import { NextFunction, Request, Response } from 'express';
import { decodeBasicAuthentication } from '../utils/authorizationUtils';
import { findApplicationByBasicAuthData } from '../services/applicationService';
import { findActiveTokenByValue } from '../repositories/accessTokenRepository';
import {
  findApplicationById,
  findApplicationByLabelAndSecret,
} from '../repositories/applicationRepository';

export const authenticateThirdPartyBasicAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('11');
  try {
    const authorization = req.headers.authorization as string;
    if (!authorization) {
      throw new Error();
    }
    console.log('12');

    const { username, secret } = decodeBasicAuthentication(authorization);
    console.log('13');

    const application = await findApplicationByLabelAndSecret({
      label: username,
      secret,
    });
    console.log('14');

    res.locals.application = application;
    next();
  } catch (e) {
    console.log('authenticateThirdPartyBasicAuth error', e);
    next(e);
  }
};

export const authenticateJwtAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization as string;
  if (!authorization) {
    throw new Error();
  }
  const accessToken = await findActiveTokenByValue(authorization.split(' ')[0]);
  if (!accessToken) {
    throw new Error('unAuthorized 401');
  }
  const application = await findApplicationById(accessToken.applicationId);
  res.locals.accessToken = accessToken;
  res.locals.application = application;
  next();
};
