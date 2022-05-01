import { generateJwt } from "./jwtService";
import { assertThrowsAsync, SEED_DATA, sleep } from "../../test/testUtils";
import { verify } from "jsonwebtoken";
import { assert } from "chai";
import { generateRandomString } from "../utils/utils";

describe("generateJwt() test cases", generateJwtTestCases);

function generateJwtTestCases() {
  it("should generate jwt successfully", () => {
    const applicationId = SEED_DATA.firstApplication.id;
    const { jwt } = generateJwt({
      lifeTimeSeconds: 1,
      payload: {
        jti: generateRandomString(10),
        applicationId: applicationId,
        scopes: ["test"],
        applicationLabel: SEED_DATA.firstApplication.label
      }
    });
    const verifiedJwt = verify(jwt, process.env.JWT_SECRET as string) as any;
    assert.isOk(verifiedJwt);
    assert.equal(verifiedJwt.applicationId, applicationId);

  });
  it("should generate jwt successfully, but expire after 2 seconds", async () => {
    const applicationId = SEED_DATA.firstApplication.id;
    const { jwt } = generateJwt({
      lifeTimeSeconds: 1,
      payload: {
        jti: generateRandomString(10),
        applicationId: applicationId,
        scopes: ["test"],
        applicationLabel: SEED_DATA.firstApplication.label
      }
    });
    const verifiedJwt = verify(jwt, process.env.JWT_SECRET as string) as any;
    assert.isOk(verifiedJwt);
    assert.equal(verifiedJwt.applicationId, applicationId);
    await sleep(2000)
    assert.throw(()=>{
      verify(jwt, process.env.JWT_SECRET as string)
    }, 'jwt expired')

  });
}
