import { findOrganizationById } from "./organizationRepository";
import { SEED_DATA } from "../../test/testUtils";
import { assert } from "chai";

describe('findOrganizationById() test cases', ()=>{
  it("should return organization by id", async() => {
    const firstOrganization = await findOrganizationById(SEED_DATA.FIRST_ORGANIZATION.id);
    assert.isOk(firstOrganization);
    assert.equal(firstOrganization?.name, SEED_DATA.FIRST_ORGANIZATION.name)
  });
  it("should return null for invalidId id", async() => {
    const firstOrganization = await findOrganizationById(0);
    assert.isNotOk(firstOrganization);
  });
})
