import express, { Request, Response } from 'express';
import { LogoutController } from '../../controllers/v1/logoutController';

export const logoutRouter = express.Router();
logoutRouter.post('/logout', async (req: Request, res: Response) => {
  const controller = new LogoutController();
  const response = await controller.logOut({ jwt: req.body.jwt });
  return res.send(response);
});
