import express from "express";
import { HealthController } from "../../controllers/v1/healthController";

export const healthRouter = express.Router();
healthRouter.get("/health", async (_req, res) => {
  const controller = new HealthController();
  const response = await controller.getMessage();
  return res.send(response);
});
