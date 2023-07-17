import express, { Request, Response } from 'express';
import { errorMessagesEnum } from '../../utils/errorMessages';
import { logger } from '../../utils/logger';
import { PassportAuthenticationController } from '@/src/controllers/v1/passportAuthenticationController';

export const passportAuthenticationRouter = express.Router();
const passportAuthenticationController = new PassportAuthenticationController();
passportAuthenticationRouter.post(
  '/passportAuthentication',
  async (req: Request, res: Response, next) => {
    try {
      const { signature, nonce, message } = req.body;
      if (!nonce || !signature || !message) {
        res.status(422).json({ message: errorMessagesEnum.MISSING_LOGIN_DATA });
        return;
      }

      const result = await passportAuthenticationController.authenticate({
        signature,
        nonce,
        message,
      });
      res.send(result);
    } catch (e) {
      logger.error('authenticationController() error', e);
      next(e);
    }
  },
);
