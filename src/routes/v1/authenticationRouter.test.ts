import axios from 'axios';
import {
  generateRandomEthereumAddress,
  serverUrl,
} from '../../../test/testUtils';
import { assert } from 'chai';
import { SiweNonce } from '../../entities/siweNonce';
import { generateNonce } from 'siwe';
import moment from 'moment';
import sinon from 'sinon';
import { SiweMessage } from 'siwe';
import { ethers } from 'ethers';

const siwe = require('siwe');
const privateKey = process.env.PRIVATE_ETHERS_TEST_KEY as string;
const provider = ethers.getDefaultProvider();

describe('/authentication test cases', authenticationTestCases);

function authenticationTestCases() {
  const domain = 'localhost';
  const origin = 'https://giveth.io';

  it('should return the public address, jwt and expiration', async () => {
    const nonce = await SiweNonce.create({
      nonce: generateNonce(),
      expirationDate: moment().add(5, 'minutes'),
    }).save();

    const wallet = new ethers.Wallet(privateKey, provider);

    const address = generateRandomEthereumAddress();
    const siweMessage = new siwe.SiweMessage({
      domain,
      address: address,
      nonce: nonce.nonce, // verification servers gives
      statement: 'This is a test statement.',
      uri: origin,
      version: '1',
      chainId: '1',
    });

    const textMessage = siweMessage.prepareMessage()
    const signature = await wallet.signMessage(textMessage);

    // for future stubbing examples
    sinon.stub(SiweMessage.prototype, 'validate').resolves(siweMessage);
    const result = await axios.post(`${serverUrl}/v1/authentication`, {
      message: textMessage,
      nonce: nonce.nonce,
      signature: signature,
    });
    assert.equal(result.status, 200);
    assert.equal(result.data.publicAddress, address);
  });
}
