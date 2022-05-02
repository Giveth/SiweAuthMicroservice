import express, { Request, Response } from 'express';
import { authenticateThirdPartyBasicAuth } from '../../middlewares/authentication';
import { TokenController } from '../../controllers/v1/tokenController';
import { logger } from '../../utils/logger';

export const tokenRouter = express.Router();
const tokenController = new TokenController();
tokenRouter.post(
  '/accessToken',
  authenticateThirdPartyBasicAuth,
  async (req: Request, res: Response, next) => {
    try {
      const { application } = res.locals;
      const result = await tokenController.generateAccessToken(
        {
          scopes: req.body.scopes,
        },
        {
          application,
        },
      );
      res.send(result);
    } catch (e) {
      next(e);
    }
  },
);
