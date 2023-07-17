import express, { Request, Response } from 'express';
import { PassportNonceController } from '@/src/controllers/v1/passportNonceController';

export const passportNonceRouter = express.Router();
passportNonceRouter.get(
  '/passportNonce',
  async (_req: Request, res: Response) => {
    const controller = new PassportNonceController();
    const response = await controller.getNonce();
    return res.send(response);
  },
);
