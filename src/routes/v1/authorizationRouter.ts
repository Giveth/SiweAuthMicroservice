import express, { Request, Response } from 'express';
import { AuthorizationController } from '../../controllers/v1/authorizationController';
import { logger } from '../../utils/logger';

export const authorizationRouter = express.Router();

const authController = new AuthorizationController();

authorizationRouter.post(
  '/authorize',
  async (req: Request, res: Response, next) => {
    try {
      const { jwt, serviceLabel } = req.body;
      const result = await authController.authorize(jwt, serviceLabel);
      res.send({
        authorized: result,
      });
    } catch (e) {
      next(e);
    }
  },
);
