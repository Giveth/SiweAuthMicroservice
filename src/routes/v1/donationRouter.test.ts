import axios from 'axios';
import {
  createAccessTokenForTest,
  SEED_DATA,
  serverUrl,
} from '../../../test/testUtils';
import { assert } from 'chai';
import { MESSAGES } from '../../utils/messages';
import { create } from 'domain';
import { createBasicAuthentication } from '../../utils/authorizationUtils';
import { scopeLabels } from '../../services/scopeService';
import { application } from 'express';

describe('/donations POST test cases', postDonationsTestCases);

function postDonationsTestCases() {
  it('should create donations successfully', async () => {
    const applicationData = SEED_DATA.firstApplication;
    const accessToken = await createAccessTokenForTest({
      scopes: [scopeLabels.CREATE_DONATION],
      applicationId: applicationData.id,
    });
    const result = await axios.post(
      `${serverUrl}/v1/donations`,
      {
        network: 'gnosis',
        txHash:
          '0x9a474c4791e526e35941dd8dd146405f15860fa19aca4abb5e0a4225294c36e0',
        nonce: 274,
        toWalletAddress: '0x4D9339dd97db55e3B9bCBE65dE39fF9c04d1C2cd',
        fromWalletAddress: '0xEf191aeb45A0d6f393D4a592f94152836d5758f8',
        priceUsd: 0.2403,
        currency: 'GIV',
        amount: 10,
      },
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      },
    );
    assert.equal(result.status, 200);
    assert.isNumber(result.data.donationId);
  });
}
