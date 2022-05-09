import express from 'express';
import { healthRouter } from './healthRouter';
import { nonceRouter } from './nonceRouter';

export const v1Router = express.Router();
v1Router.use('/v1', healthRouter);
v1Router.use('/v1', nonceRouter);

