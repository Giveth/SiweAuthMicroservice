import express, { Request, Response } from 'express';
import { errorMessagesEnum } from '@/src/utils/errorMessages';
import { logger } from '@/src/utils/logger';
import { getMultisigSessionsCount } from '@/src/repositories/multisigSessionRepository';

export const multisigSessionCountRouter = express.Router();
multisigSessionCountRouter.get(
  '/multisigSessionCount',
  async (req: Request, res: Response, next) => {
    try {
      const { from, to } = req.query;
      if (!from || !to) {
        res.status(422).json({ message: errorMessagesEnum.MULTISIG_SESSION_COUNTS_INVALID_REQUEST });
        return;
      }

      const count = await getMultisigSessionsCount(new Date(String(from)), new Date(String(to)));

      res.send({
        count,
      });
    } catch (e) {
      logger.error('get multisigSessionCount error', e);
      next(e);
    }
  },
);
