import { NextFunction, Request, Response } from 'express';
import { StandardError } from '../types/StandardError';
import { errorMessagesEnum } from '../utils/errorMessages';

export const getAccessScopeMiddleware = (params: { scope: string }) => {
  const { scope } = params;

  return (_req: Request, res: Response, next: NextFunction) => {
    const accessToken = res.locals.accessToken;
    if (accessToken.scopes.includes(scope)) {
      return next();
    }
    const error = new StandardError(
      errorMessagesEnum.TOKEN_DOESNT_HAVE_ACCESS_TO_THIS_SCOPE,
    );
    error.message += scope;
    throw error;
  };
};
