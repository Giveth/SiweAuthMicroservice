import express, { Request, Response } from 'express';
import { AuthenticationController } from '../../controllers/v1/authenticationController';
import { errorMessagesEnum } from '../../utils/errorMessages';
import { logger } from '../../utils/logger';

export const authenticationRouter = express.Router();
const authController = new AuthenticationController();
authenticationRouter.post(
  '/authentication',
  async (req: Request, res: Response, next) => {
    try {
      if (!req.body.message || !req.body.nonce || !req.body.signature) {
        res.status(422).json({ message: errorMessagesEnum.MISSING_LOGIN_DATA });
        return;
      }

      const { message, signature, nonce } = req.body;
      const result = await authController.ethereumAuthenticate({
        message,
        signature,
        nonce,
      });
      res.send(result);
    } catch (e) {
      logger.error('authenticationController() error', e);
      next(e);
    }
  },
);

authenticationRouter.post(
  '/solanaAuthentication',
  async (req: Request, res: Response, next) => {
    try {
      if (
        !req.body.message ||
        !req.body.nonce ||
        !req.body.signature ||
        !req.body.address
      ) {
        res.status(422).json({ message: errorMessagesEnum.MISSING_LOGIN_DATA });
        return;
      }

      const { nonce, message, signature, address } = req.body;
      const result = await authController.solanaAuthenticate({
        message,
        signature,
        address,
        nonce,
      });
      res.send(result);
    } catch (e) {
      logger.error('authenticationController() error', e);
      next(e);
    }
  },
);
