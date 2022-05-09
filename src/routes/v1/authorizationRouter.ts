import express, { Request, Response } from 'express';
import { AuthenticationController } from '../../controllers/v1/authenticationController';
import { logger } from '../../utils/logger';

export const tokenRouter = express.Router();
const authController = new AuthenticationController();
tokenRouter.post(
  '/authorize',
  async (req: Request, res: Response, next) => {
    try {
      const { jwt } = req.body;
      const result = await authController.authenticate(
        { jwt }
      );
      res.send(result);
    } catch (e) {
      next(e);
    }
  },
);
