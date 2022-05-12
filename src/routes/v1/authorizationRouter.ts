import express, { Request, Response } from 'express';
import { AuthorizationController } from '../../controllers/v1/authorizationController';
import { logger } from '../../utils/logger';

export const authorizationRouter = express.Router();

const authController = new AuthorizationController();

authorizationRouter.post(
  '/authorization',
  async (req: Request, res: Response, next) => {
    try {
      const { jwt } = req.body;
      const result = await authController.authorize({ jwt });
      res.send(result);
    } catch (e) {
      logger.error('authorizationController() error', e);
      next(e);
    }
  },
);
