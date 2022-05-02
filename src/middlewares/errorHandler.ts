import { ErrorRequestHandler, NextFunction, Request } from 'express';
import { StandardError } from '../types/StandardError';
import { errorMessagesEnum } from '../utils/errorMessages';
import { logger } from '../utils/logger';

export const errorHandler: ErrorRequestHandler = async (
  error,
  req,
  res,
  next,
) => {
  logger.error('errorHandler ', {
    error,
  });
  const { body, query, params, headers, method } = req;
  const url = req.protocol + '://' + req.get('Host') + req.originalUrl;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const httpStatus =
    error instanceof StandardError ? (error.httpStatusCode as number) : 500;
  res.status(httpStatus);
  const errorBody =
    error instanceof StandardError
      ? error
      : new StandardError(errorMessagesEnum.INTERNAL_SERVER_ERROR);
  res.send(errorBody);
};

export const throwErrorIfInstanceOfStandardError = (e: Error) => {
  if (e instanceof StandardError) {
    throw e;
  }
};
