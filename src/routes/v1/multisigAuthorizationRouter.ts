import express, { Request, Response } from 'express';
import { MultisigAuthorizationController } from '../../controllers/v1/multisigAuthorizationController';
import { logger } from '../../utils/logger';

export const multisigAuthorizationRouter = express.Router();

const authController = new MultisigAuthorizationController();

multisigAuthorizationRouter.post(
  '/multisigAuthorization',
  async (req: Request, res: Response, next) => {
    try {
      const { network, multisigAddress, jwt } = req.body;
      const result = await authController.authorize({
        network,
        multisigAddress,
        jwt,
      });
      res.send(result);
    } catch (e) {
      logger.error('authorizationController() error', e);
      next(e);
    }
  },
);
