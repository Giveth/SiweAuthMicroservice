import express, { Request, Response } from 'express';
import { AuthenticationController } from '../../controllers/v1/authenticationController';
import { logger } from '../../utils/logger';

export const authenticationRouter = express.Router();
const authController = new AuthenticationController();
authenticationRouter.post(
  '/authenticate',
  async (req: Request, res: Response, next) => {
    try {
      if (!req.body.message || !req.body.nonce) {
        res
          .status(422)
          .json({ message: 'Expected message or nonce to be present in body' });
        return;
      }

      const { message, signature, nonce } = req.body;
      const result = await authController.authenticate({
        message,
        signature,
        nonce,
      });
      res.send(result);
    } catch (e) {
      next(e);
    }
  },
);
