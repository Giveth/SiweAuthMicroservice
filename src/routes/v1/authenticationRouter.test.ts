import axios from 'axios';
import { generateRandomEthereumAddress, serverUrl } from '../../../test/testUtils';
import { assert } from 'chai';
import { SiweNonce } from '../../entities/siweNonce';
import { generateNonce } from 'siwe';
import moment from 'moment';
import sinon from 'sinon';
import { SiweMessage } from 'siwe';
const siwe = require('siwe');

describe('/authentication test cases', authenticationTestCases);

function authenticationTestCases() {
  const domain = "localhost";
  const origin = "https://localhost/v1/authentication";

  it('should return the public address, jwt and expiration', async () => {
    const nonce = await SiweNonce.create({
      nonce: generateNonce(),
      expirationDate: moment().add(5, 'minutes'),
    }).save();

    const address = generateRandomEthereumAddress();
    const siweMessage = new siwe.SiweMessage({
      domain,
      address: address,
      nonce: nonce.nonce,
      statement: 'This is a test statement.',
      uri: origin,
      version: '1',
      chainId: '1'
    });

    sinon.stub(SiweMessage.prototype, 'validate').resolves(siweMessage);
    const result = await axios.post(`${serverUrl}/v1/authentication`,
    {
      message: siweMessage.prepareMessage(),
      nonce: nonce.nonce,
      signature: '0xc993a34ff3261732402576873a2e8e0983a5dc03'
    });
    assert.equal(result.status, 200);
    assert.equal(result.data.publicAddress, address);
  });
}
