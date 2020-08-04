import "mocha";
import { expect } from "chai";
import { Container, DiErrorCode } from "../../../src";
import { JwtModule } from "../../fixture/pkg/jwt/jwt.module";
import { Md2Service } from "../../fixture/pkg/jwt/md2.service";
import { Md5Service } from "../../fixture/pkg/jwt/md5.service";
import { Sha1Service } from "../../fixture/pkg/jwt/sha1.service";

describe("Provider - useModule", () => {
  let container: Container;

  beforeEach(() => {
    // clean static _ModuleMap
    (Container as any)._ModuleMap = new Map();

    container = new Container();
  });

  it("can resolve provider from other module without importing into container", () => {
    container.addProviders([
      { token: Md2Service, useModule: JwtModule },
      { token: Md5Service, useModule: JwtModule },
    ]);

    const md2Service = container.resolve<Md2Service>(Md2Service);
    const md5Service = container.resolve<Md5Service>(Md5Service);

    md2Service.hash("run without crash");
    md5Service.hash("run without crash");

    try {
      container.resolve(Sha1Service);

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(DiErrorCode.NoProviderForToken);
    }
  });

  it("can not use invalid module as argument for useModule", () => {
    try {
      container.addProviders([
        { token: Md2Service, useModule: Md2Service },
      ]);

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(DiErrorCode.InvalidModuleClass);
    }
  });
})