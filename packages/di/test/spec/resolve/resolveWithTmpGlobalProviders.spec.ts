import "mocha";
import { expect } from "chai";
import { Container, DiErrorCode } from "../../../src";
import { request, dummyAccessToken } from "../../fixture/const/data.const";
import { UserModule } from "../../fixture/user/user.module";
import { CreateProfile } from "../../fixture/user/events/create-profile";
import { UpdateProfile } from "../../fixture/user/events/update-profile";

let container: Container;

beforeEach(() => {
  container = new Container();
  container.addModule(UserModule);
});

describe("Container - resolveWithTmpGlobalProviders():", () => {
  it("can resolve temporary global providers", async () => {
    await container.resolveWithTmpGlobalProviders(UpdateProfile, [
      { token: request, useValue: { name: 'foo', userId: 1, token: dummyAccessToken } },
    ]);
  });

  it("will remove temporary global provider after resolve value when provider has token", async  () => {
    await container.resolveWithTmpGlobalProviders(UpdateProfile, [
      { token: request, useValue: { name: 'foo', userId: 1, token: dummyAccessToken } },
    ]);

    try {
      await container.resolve(UpdateProfile);

      throw new Error();
    } catch (err) {
      expect(err.code).to.equal(DiErrorCode.NoProviderForToken);
    }
  });

  it("will remove temporary global provider after resolve value even if provider is a class", async () => {
    class Foo { }

    await container.resolveWithTmpGlobalProviders(CreateProfile, [
      { token: request, useValue: { token: dummyAccessToken } },
      Foo
    ]);

    await container.resolveWithTmpGlobalProviders(CreateProfile, [
      { token: request, useValue: { token: dummyAccessToken } },
      Foo
    ]);
  })

  it("will remove temporary global provider when error occurs", async () => {
    const container = new Container();
    container.addModule(UserModule);

    try {
      await container.resolveWithTmpGlobalProviders(UpdateProfile, [
        { token: request, useValue: { name: 'foo', userId: 1, token: 'bar' } },
      ]);
    } catch (e) {
      expect(container.has(request)).to.false;
    }
  });
});