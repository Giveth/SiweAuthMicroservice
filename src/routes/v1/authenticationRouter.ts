import express, { Request, Response } from 'express';
import { AuthenticationController } from '../../controllers/v1/authenticationController';
import { logger } from '../../utils/logger';

export const tokenRouter = express.Router();
const authController = new AuthenticationController();
tokenRouter.post(
  '/authenticate',
  async (req: Request, res: Response, next) => {
    try {
      const { message, signature } = req.body;
      const result = await authController.authenticate(
        { message, signature }
      );
      res.send(result);
    } catch (e) {
      next(e);
    }
  },
);
