import axios, { AxiosResponse } from 'axios';
import { serverUrl } from '@/test/testUtils';
import { assert } from 'chai';
import { ethers } from 'ethers';

const privateKey = process.env.PRIVATE_ETHERS_TEST_KEY as string;
const publicKey = process.env.PUBLIC_ETHERS_TEST_KEY as string;
const provider = ethers.getDefaultProvider();

describe('/authentication test cases', authenticationTestCases);

function authenticationTestCases() {
  it('should return the public address', async () => {
    const nonceResult: AxiosResponse = await axios.get(
      `${serverUrl}/v1/passportNonce`,
    );
    const { nonce, message } = nonceResult.data;

    const wallet = new ethers.Wallet(privateKey, provider);
    const signature = await wallet.signMessage(message);

    // for future stubbing examples
    // sinon.stub(SiweMessage.prototype, 'validate').resolves(siweMessage);
    const result = await axios.post(`${serverUrl}/v1/passportAuthentication`, {
      nonce: nonce,
      signature: signature,
      message: message,
    });
    assert.equal(result.status, 200);
    assert.equal(result.data.publicAddress, publicKey);
  });
}
