import axios from 'axios';
import { serverUrl } from '../../../test/testUtils';
import { assert } from 'chai';
import { MESSAGES } from '../../utils/messages';
import { SiweNonce } from '../../entities/siweNonce';

describe('/nonce test cases', siweNonceTestCases);

function siweNonceTestCases() {
  it('should return an autogenerated nonce and a valid success response', async () => {
    const result = await axios.get(`${serverUrl}/v1/nonce`);
    assert.equal(result.status, 200);
    const siweNonce = SiweNonce.createQueryBuilder('siweNonce')
      .where(`"siweNonce".nonce = :nonce`, { nonce: result.data.message })
      .getOne();
    assert.ok(siweNonce);
  });
}
