import axios from 'axios';
import { serverUrl } from '@/test/testUtils';
import { assert, expect } from 'chai';
import { PassportNonce } from '@/src/controllers/v1/passportNonceController';

describe('/passport nonce test cases', passportNonceTestCases);

function passportNonceTestCases() {
  it('should return a well format GitCoin Passport Nonce', async () => {
    const result = await axios.get(`${serverUrl}/v1/passportNonce`);
    assert.equal(result.status, 200);
    const { message, nonce }: PassportNonce = result.data;
    expect(message.indexOf(`Nonce: ${nonce}`)).greaterThan(-1);
  });
}
