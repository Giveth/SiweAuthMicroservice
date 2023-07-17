import express from 'express';
import { authenticationRouter } from './authenticationRouter';
import { authorizationRouter } from './authorizationRouter';
import { healthRouter } from './healthRouter';
import { logoutRouter } from './logoutRouter';
import { nonceRouter } from './nonceRouter';
import { passportNonceRouter } from '@/src/routes/v1/passportNonceRouter';
import { passportAuthenticationRouter } from '@/src/routes/v1/passportAuthenticationRouter';

export const v1Router = express.Router();
v1Router.use('/v1', healthRouter);
v1Router.use('/v1', nonceRouter);
v1Router.use('/v1', authorizationRouter);
v1Router.use('/v1', authenticationRouter);
v1Router.use('/v1', logoutRouter);

// Passport routes
v1Router.use('/v1', passportNonceRouter);
v1Router.use('/v1', passportAuthenticationRouter);
