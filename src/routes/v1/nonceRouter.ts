import express, { Request, Response } from 'express';
import { NonceController } from '../../controllers/v1/nonceController';

export const nonceRouter = express.Router();
nonceRouter.get('/', async (_req: Request, res: Response) => {
  const controller = new NonceController();
  const response = await controller.getNonce();
  return res.send(response);
});
