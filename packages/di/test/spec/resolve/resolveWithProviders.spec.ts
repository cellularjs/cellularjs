import "mocha";
import { expect } from "chai";
import { Container, DiErrorCode } from "../../../src";
import { request } from "../../fixture/const/data.const";
import { CreateProfileReq } from "../../fixture/user/services/create-profile.req";

describe("Container - resolveWithProviders():", () => {
  it("can resolve with temporary providers", async () => {
    // can resolve with temporary providers
    const container = new Container;
    container.addProvider(CreateProfileReq);

    const createProfileData = { name: "X", age: 999 };
    const actualRs = await container.resolveWithProviders(CreateProfileReq, [
      { token: request, useValue: createProfileData },
    ]);

    expect(actualRs).to.eqls(createProfileData);

    // make sure providers is really temporary.
    try {
      await container.resolve(CreateProfileReq);

      expect(false).to.true;
    } catch (err) {
      // request does not exist anymore
      expect(err.code).to.equal(DiErrorCode.NoProviderForToken);
    }
  });
});