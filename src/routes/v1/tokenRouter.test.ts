import axios from 'axios';
import { SEED_DATA, serverUrl } from '../../../test/testUtils';
import { assert } from 'chai';
import { MESSAGES } from '../../utils/messages';
import { create } from 'domain';
import { createBasicAuthentication } from '../../utils/authorizationUtils';
import { scopeLabels } from '../../services/scopeService';

describe('/accessToken POST test cases', postAccessTokenTestCases);

function postAccessTokenTestCases() {
  it('should return success response', async () => {
    const applicationData = SEED_DATA.firstApplication;
    const result = await axios.post(
      `${serverUrl}/v1/accessToken`,
      {
        scopes: [scopeLabels.CREATE_DONATION],
      },
      {
        headers: {
          authorization: createBasicAuthentication({
            username: applicationData.label,
            secret: applicationData.secret,
          }),
        },
      },
    );
    assert.equal(result.status, 200);
    assert.isOk(result.data.accessToken);
    assert.equal(result.data.payload.applicationId, applicationData.id);
  });
}
