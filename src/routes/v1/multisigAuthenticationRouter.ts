import express, { Request, Response } from 'express';
import { errorMessagesEnum } from '../../utils/errorMessages';
import { logger } from '../../utils/logger';
import { MultisigAuthenticationController } from '@/src/controllers/v1/multisigAuthenticationController';
import { findNonExpiredMultisigSessions } from '@/src/repositories/multisigSessionRepository';
import {
  MultisigSession,
  MultisigStatuses,
} from '@/src/entities/multisigSession';
import moment from 'moment';
import { fetchSafeMessage } from '@/src/services/safeServices';

export const multisigAuthenticationRouter = express.Router();
const multisigAuthenticationController = new MultisigAuthenticationController();
multisigAuthenticationRouter.post(
  '/multisigAuthentication',
  async (req: Request, res: Response, next) => {
    try {
      const { safeAddress, network, jwt } = req.body;
      const safeMessageTimestamp = req.body?.safeMessageTimestamp;
      const approvalExpirationDays = req.body?.approvalExpirationDays;
      if (!safeAddress || !jwt || !network) {
        res.status(422).json({ message: errorMessagesEnum.MISSING_LOGIN_DATA });
        return;
      }

      const result = await multisigAuthenticationController.authenticate({
        approvalExpirationDays,
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

multisigAuthenticationRouter.get(
  '/multisigAuthentication',
  async (req: Request, res: Response, next) => {
    try {
      const { safeAddress, network } = req.query;
      if (!safeAddress || !network) {
        res.status(422).json({ message: errorMessagesEnum.MISSING_LOGIN_DATA });
        return;
      }

      const multisigSession = await findNonExpiredMultisigSessions(
        String(safeAddress),
        Number(network),
      );

      if (multisigSession) {
        const safeMessage = await fetchSafeMessage(
          multisigSession.safeMessageHash,
          multisigSession.network,
        );

        await multisigSession.multisigStatus(safeMessage);
        await multisigSession.reload();
      }

      res.send({
        status: multisigSession
          ? multisigSession.status
          : MultisigStatuses.NotFound,
        active: multisigSession?.active || false,
      });
    } catch (e) {
      logger.error('multisigAuthenticationController() error', e);
      next(e);
    }
  },
);
