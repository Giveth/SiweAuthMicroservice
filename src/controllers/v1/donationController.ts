import { Body, Inject, Post, Route, Security, Tags } from "tsoa";
import { AccessToken } from "../../entities/accessToken";
import { Application } from "../../entities/application";
import { CreateDonationRequest, CreateDonationResponse } from "../../types/requestResponses";
import { logger } from "../../utils/logger";
import { createDonationValidator, validateWithJoiSchema } from "../../validators/schemaValidators";
import { getGivethIoAdapterInstance } from "../../adapters/adapterFactory";

@Route('/v1/donations')
@Tags('Donation')
export class DonationController {
  @Post('/')
  @Security('JWT')
  public async createDonation(
    @Body() body: CreateDonationRequest,
    @Inject()
    params: {
      application: Application;
      accessToken: AccessToken;
    },
  ): Promise<CreateDonationResponse> {
    try {
      validateWithJoiSchema(body, createDonationValidator);
      const givethIoAdapter = getGivethIoAdapterInstance();
      const { donationId } = await givethIoAdapter.createDonation({
        inputData: body,
        application: params.application,
      });
      return { donationId };
    } catch (e) {
      logger.error('donationController error', e);
      throw e;
    }
  }
}
