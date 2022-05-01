import {
  findApplicationById,
  findApplicationByIdJoinOrganization,
  findApplicationByLabelAndSecret,
} from './applicationRepository';
import { SEED_DATA } from '../../test/testUtils';
import { assert } from 'chai';
import { generateRandomString } from '../utils/utils';

describe(
  'findApplicationByLabelAndSecret() testCases',
  findApplicationByLabelAndSecretTestCases,
);
describe('findApplicationById() test cases', findApplicationByIdTestCases);
describe(
  'findApplicationByIdJoinOrganization() test cases',
  findApplicationByIdJoinOrganizationTestCases,
);

function findApplicationByIdTestCases() {
  it('should return application by id', async () => {
    const firstApplication = await findApplicationById(
      SEED_DATA.firstApplication.id,
    );
    assert.isOk(firstApplication);
    assert.equal(firstApplication?.name, SEED_DATA.firstApplication.name);
  });
  it('should return application by id, but not join with organization', async () => {
    const firstApplication = await findApplicationById(
      SEED_DATA.firstApplication.id,
    );
    assert.isOk(firstApplication);
    assert.equal(firstApplication?.name, SEED_DATA.firstApplication.name);
    assert.isNotOk(firstApplication?.organization);
  });
  it('should return null for invalidId id', async () => {
    const firstApplication = await findApplicationById(0);
    assert.isNotOk(firstApplication);
  });
}

function findApplicationByIdJoinOrganizationTestCases() {
  it('should return application by id', async () => {
    const firstApplication = await findApplicationByIdJoinOrganization(
      SEED_DATA.firstApplication.id,
    );
    assert.isOk(firstApplication);
    assert.equal(firstApplication?.name, SEED_DATA.firstApplication.name);
    assert.equal(
      firstApplication?.organization.id,
      SEED_DATA.firstApplication.organizationId,
    );
  });
  it('should return null for invalidId id', async () => {
    const firstApplication = await findApplicationByIdJoinOrganization(0);
    assert.isNotOk(firstApplication);
  });
}

function findApplicationByLabelAndSecretTestCases() {
  it('should find application by label and secret successfully', async () => {
    const application = await findApplicationByLabelAndSecret({
      label: SEED_DATA.firstApplication.label,
      secret: SEED_DATA.firstApplication.secret,
    });
    assert.isOk(application);
    assert.equal(application?.id, SEED_DATA.firstApplication.id);
  });

  it('should not find application when label is incorrect', async () => {
    const application = await findApplicationByLabelAndSecret({
      label: generateRandomString(10),
      secret: SEED_DATA.firstApplication.secret,
    });
    assert.isNotOk(application);
  });
  it('should not find application when label is incorrect', async () => {
    const application = await findApplicationByLabelAndSecret({
      label: SEED_DATA.firstApplication.label,
      secret: generateRandomString(10),
    });
    assert.isNotOk(application);
  });
}
