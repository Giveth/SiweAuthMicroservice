import axios from 'axios';
import { generateRandomEthereumAddress, serverUrl } from '../../../test/testUtils';
import { assert } from 'chai';
import { generateAccessToken } from '../../services/authenticationService';

describe('/authorization test cases', authorizationTestCases);

function authorizationTestCases() {
  it('should return the public address, jwt and expiration', async () => {
    const fields = { address: generateRandomEthereumAddress(),  }
    const token = await generateAccessToken(fields);

    const jwt = token.jwt;
    const result = await axios.post(`${serverUrl}/v1/authorization`,{ jwt: jwt });
    assert.equal(result.status, 200);
    assert.equal(result.data.publicAddress, token.publicAddress);
  });
}
