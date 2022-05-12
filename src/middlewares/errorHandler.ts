import { ErrorRequestHandler } from 'express';
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
