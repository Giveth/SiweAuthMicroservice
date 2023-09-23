import express, { Request, Response } from 'express';
import { errorMessagesEnum } from '../../utils/errorMessages';
import { logger } from '../../utils/logger';
import { MultisigAuthenticationController } from '@/src/controllers/v1/multisigAuthenticationController';

export const multisigAuthenticationRouter = express.Router();
const multisigAuthenticationController = new MultisigAuthenticationController();
multisigAuthenticationRouter.post(
  '/multisigAuthentication',
  async (req: Request, res: Response, next) => {
    try {
      const { safeAddress, network, jwt } = req.body;
      const safeMessageTimestamp = req.body?.safeMessageTimestamp;
      if (!safeAddress || !jwt || !network) {
        res.status(422).json({ message: errorMessagesEnum.MISSING_LOGIN_DATA });
        return;
      }

      const result = await multisigAuthenticationController.authenticate({
        safeMessageTimestamp,
        safeAddress,
        network,
        jwt,
      });
      res.send(result);
    } catch (e) {
      logger.error('multisigAuthenticationController() error', e);
      next(e);
    }
  },
);
