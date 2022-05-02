import { Route, Tags, Post, Body, Security, Inject, Example } from 'tsoa';
import { AccessToken } from '../../entities/accessToken';
import { Application } from '../../entities/application';
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
import { getGivethIoAdapterInstance } from '../../adapters/adapterFactory';

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
      // const donationId = await createDonation({
      //   application: params.application,
      //   inputData: body,
      // });
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
