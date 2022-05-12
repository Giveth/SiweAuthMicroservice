import { generateJwt } from './jwtService';
import {
  assertThrowsAsync,
  generateRandomEthereumAddress,
  sleep,
} from '../../test/testUtils';
import { verify } from 'jsonwebtoken';
import { assert } from 'chai';
import { generateRandomString } from '../utils/utils';
import moment from 'moment';

describe('generateJwt() test cases', generateJwtTestCases);

function generateJwtTestCases() {
  it('should generate jwt successfully', () => {
    const fields = { address: generateRandomEthereumAddress() };
    const expirationDate = moment().add(1, 'hour');

    const jwt = generateJwt({
      jti: generateRandomString(10),
      publicAddress: fields.address,
      expirationDate: expirationDate.toDate(),
    });
    const verifiedJwt = verify(jwt, process.env.JWT_SECRET as string) as any;
    assert.isOk(verifiedJwt);
    assert.equal(verifiedJwt.publicAddress, fields.address);
  });
  it('should generate jwt successfully, but expire after 2 second', async () => {
    const fields = { address: generateRandomEthereumAddress() };
    const expirationDate = moment().add(2000, 'milliseconds');

    const jwt = generateJwt({
      jti: generateRandomString(10),
      publicAddress: fields.address,
      expirationDate: expirationDate.toDate(),
    });
    const verifiedJwt = verify(jwt, process.env.JWT_SECRET as string) as any;
    assert.isOk(verifiedJwt);
    assert.equal(verifiedJwt.publicAddress, fields.address);
    await sleep(2000);
    assert.throw(() => {
      verify(jwt, process.env.JWT_SECRET as string);
    }, 'jwt expired');
  });
}
