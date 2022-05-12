import axios from 'axios';
import {
  generateRandomEthereumAddress,
  serverUrl,
} from '../../../test/testUtils';
import { assert } from 'chai';
import moment from 'moment';
import { generateRandomString } from '../../utils/utils';
import { generateJwt } from '../../services/jwtService';
import { AccessToken } from '../../entities/accessToken';

describe('/logout test cases', logoutTestCases);

function logoutTestCases() {
  it('should blacklist valid jwt', async () => {
    const fields = { address: generateRandomEthereumAddress() };
    const expirationDate = moment().add(1, 'hour');
    const jti = generateRandomString(10);

    const jwt = generateJwt({
      jti: jti,
      publicAddress: fields.address,
      expirationDate: expirationDate.toDate(),
    });

    const newToken = AccessToken.create({
      jti: jti,
      jwt: jwt,
      publicAddress: fields.address,
      expirationDate: expirationDate,
    });

    await newToken.save();

    const result = await axios.post(`${serverUrl}/v1/logout`, {
      jwt: jwt,
    });
    assert.equal(result.status, 200);
    const token = await AccessToken.createQueryBuilder()
      .where('jwt = :token', { token: jwt })
      .getOne();
    assert.isTrue(token!.isBlacklisted);
  });
}
