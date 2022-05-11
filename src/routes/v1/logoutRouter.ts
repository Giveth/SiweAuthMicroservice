import express, { Request, Response } from 'express';
import { HealthController } from '../../controllers/v1/healthController';
import { LogoutController } from '../../controllers/v1/logoutController';

export const logoutRouter = express.Router();
logoutRouter.post('/logout', async (req: Request, res: Response) => {
  const controller = new LogoutController();
  const response = await controller.logOut(req.body.jwt);
  return res.send(response);
});
