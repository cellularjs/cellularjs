import "mocha";
import { expect } from "chai";
import { Module, Container, DiErrorCode, Injectable, getModuleMeta } from "../../../src";
import { JwtModule } from "../../fixture/pkg/jwt/jwt.module";
import { JwtService } from "../../fixture/pkg/jwt/jwt.service";
import { MongoService } from "../../fixture/pkg/mongo/mongo.service";
import { AuthModule } from "../../fixture/auth/auth.module";
import { UserModule } from "../../fixture/user/user.module";
import { CreateProfile } from "../../fixture/user/events/create-profile";
import { request } from "../../fixture/const/data.const";
import { Verify } from "../../fixture/auth/events/verify";
import { SharedModule } from "../../fixture/pkg/shared.module";

describe("Annotation - Module(): define modular dependency injection", () => {
  let container: Container;

  beforeEach(() => {
    // clean static _ModuleMap
    (Container as any)._ModuleMap = new Map();

    container = new Container();
  });

  it("can use a class as useClass provider inside providers", () => {
    container.addModule(JwtModule);

    const jwtService = container.resolve<JwtService>(JwtService);

    jwtService.md5Hash("run without crash");
  });

  it("can use useClass provider inside providers", () => {
    container.addModule(JwtModule);

    const jwtService = container.resolve<JwtService>(JwtService);

    jwtService.sha1Hash("run without crash");
  });

  it("can use useFunc provider inside providers", () => {
    container.addModule(JwtModule);

    const jwtService = container.resolve<JwtService>(JwtService);

    jwtService.sha256Hash("run without crash");
  });

  it("can use useValue provider inside providers", () => {
    container.addModule(JwtModule);

    const jwtService = container.resolve<JwtService>(JwtService);

    jwtService.md2Hash("run without crash");
  });

  it("can import other modules", async () => {
    container.addModule(AuthModule);

    const verifyHanlder = container.resolve<Verify>(Verify);

    expect(await verifyHanlder.handle()).to.true;
  });

  it("can add a extend module into imports config", async () => {
    const createProfileData = { name: "X", age: 999 };
    container.addModule({
      extModule: UserModule,
      providers: [
        { token: request, useValue: createProfileData },
      ],
    });

    const createProfile = container.resolve<CreateProfile>(CreateProfile);

    const expectedRs = { ...createProfileData, id: 1 };
    const actualRs = await createProfile.handle();

    expect(actualRs).to.eqls(expectedRs);
  });

  it("can not resolve provider that import from other module", () => {
    container.addModule(AuthModule);

    try {
      container.resolve(JwtService);

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(DiErrorCode.NoProviderForToken);
    }
  });

  it("can export services from module", () => {
    container.addModule(JwtModule);

    const jwtService = container.resolve(JwtService);

    expect(jwtService).to.instanceOf(JwtService);
  });

  it("can export other modules", () => {
    container.addModule(SharedModule);

    const jwtService = container.resolve(JwtService);

    expect(jwtService).to.instanceOf(JwtService);
  });

  it("can add a extend module into exports config", () => {
    container.addModule(SharedModule);

    const mongoService = container.resolve(MongoService);

    expect(mongoService).to.instanceOf(MongoService);
  });

  it("can not import a class has not been decorated by @Module annotation", () => {
    try {
      container.addModule(JwtService);

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(DiErrorCode.InvalidModuleClass);
    }
  });

  it("can not import same module because that module may export same service causing duplicate token", () => {
    container.addModule(SharedModule);

    try {
      container.addModule(SharedModule);

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(DiErrorCode.DuplicateToken);
    }
  });

  it("service class can not exist in both providers and exports", () => {
    class FooService { }

    @Module({
      providers: [FooService],
      exports: [FooService],
    })
    class FooBarModule { }

    try {
      container.addModule(FooBarModule)

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(DiErrorCode.DuplicateToken);
    }
  });

  it("there is no need to add service class - that is also exported into providers before resolving", () => {
    class FooService {
      run = () => "fooService";
    }

    @Injectable()
    class BarService {
      constructor(
        private fooService: FooService,
      ) { }

      runFoo = () => this.fooService.run();

      run = () => "barService";
    }

    @Module({
      exports: [FooService, BarService],
    })
    class FooBarModule { }

    container.addModule(FooBarModule);

    const barService = container.resolve<BarService>(BarService);

    expect(barService.run()).to.equal("barService");
    expect(barService.runFoo()).to.equal("fooService");
  });

  it("can be detected as cellularjs module", () => {
    expect(getModuleMeta(JwtModule)).to.exist;
  });
});
