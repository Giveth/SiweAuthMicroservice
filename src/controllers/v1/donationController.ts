import { Route, Tags, Post, Body, Security, Inject } from 'tsoa';
import { AccessToken } from '../../entities/accessToken';
import { Application } from '../../entities/application';
import { createDonation } from '../../services/donationService';
import {
  CreateDonationRequest,
  CreateDonationResponse,
} from '../../types/requestResponses';
import { logger } from '../../utils/logger';

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
      const donationId = await createDonation({
        application: params.application,
        inputData: body,
      });
      return { donationId };
    } catch (e) {
      logger.error('donationController error', e);
      throw e;
    }
  }
}
