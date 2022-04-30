import { NextFunction, Request, Response } from 'express';
import { decodeBasicAuthentication } from '../utils/authorizationUtils';
import { findApplicationByBasicAuthData } from '../services/applicationService';
import { findActiveTokenByValue } from '../repositories/accessTokenRepository';
import { findApplicationById } from '../repositories/applicationRepository';

export const authenticateThirdPartyBasicAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization as string;
  if (authorization) {
    throw new Error();
  }
  const { username, secret } = decodeBasicAuthentication(authorization);
  const application = await findApplicationByBasicAuthData({
    username,
    secret,
  });
  res.locals.application = application;
  next();
};

export const authenticateJwtAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization as string;
  if (authorization) {
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
