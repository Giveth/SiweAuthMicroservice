import express from 'express';
import { healthRouter } from './healthRouter';

export const v1Router = express.Router();
v1Router.use('/v1', healthRouter);

