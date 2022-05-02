import { Route, Tags, Post, Body, Security, Inject, Example } from 'tsoa';
import { AccessToken } from '../../entities/accessToken';
import { Application } from '../../entities/application';
import { createDonation } from '../../services/donationService';
import {
  CreateDonationRequest,
  CreateDonationResponse,
} from '../../types/requestResponses';
import { logger } from '../../utils/logger';
import {
  createDonationValidator,
  validateWithJoiSchema,
} from '../../validators/schemaValidators';
import {
  generateRandomEthereumAddress,
  generateRandomTxHash,
} from '../../../test/testUtils';

@Route('/v1/donations')
@Tags('Donation')
export class DonationController {
  @Post('/')
  @Security('JWT')
  public async createDonation(
    @Body() body: CreateDonationRequest,
    // @Example<CreateDonationRequest>({
    //   currency: 'DAI',
    //   nonce:1,
    //   network:'gnosis',
    //   txHash: generateRandomTxHash(),
    //   fromWalletAddress: generateRandomEthereumAddress(),
    //   toWalletAddress: generateRandomEthereumAddress(),
    //   amount: 10,
    //   priceUsd:1
    // })
    @Inject()
    params: {
      application: Application;
      accessToken: AccessToken;
    },
  ): Promise<CreateDonationResponse> {
    try {
      validateWithJoiSchema(body, createDonationValidator);
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
