import express, { Request, Response } from "express";
import { authenticateJwtAccessToken } from "../../middlewares/authentication";
import { getAccessScopeMiddleware } from "../../middlewares/authorization";
import { DonationController } from "../../controllers/v1/donationController";
import { logger } from "../../utils/logger";

export const donationRouter = express.Router();
const donationController = new DonationController();
donationRouter.post("/donations",
  authenticateJwtAccessToken,
  getAccessScopeMiddleware({
    scope:'',
  }),
  async (req: Request, res: Response) => {
    try {
      const { application, accessToken } = res.locals;
      const result = await donationController.createDonation(req.body,
        {
          application,
          accessToken
        });
      res.send(result);
    } catch (e) {
      logger.error('/donations POST error', e)
      throw e;
    }

  });
