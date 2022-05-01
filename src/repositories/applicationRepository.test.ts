import {
  findApplicationById,
  findApplicationByIdJoinOrganization,
} from './applicationRepository';
import { SEED_DATA } from '../../test/testUtils';
import { assert } from 'chai';

describe('findApplicationById() test cases', () => {
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
});

describe('findApplicationByIdJoinOrganization() test cases', () => {
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
});
