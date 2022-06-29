import 'mocha';
import { expect } from 'chai';
import { Module, Injectable, Container, clearModuleMap } from '@cellularjs/di';
import { EnvModule } from '../../src';
import { EnvErrorCode } from '../../src/errors';
import { clearParsedEnv } from '../../src/env.module';

interface Env {
  PORT: number;
}
class Env {}

describe('EnvModule.config()', () => {
  beforeEach(() => {
    clearParsedEnv();
    clearModuleMap();
  });

  it('will throw error if user use EnvModule instead of EnvModule.config for importing the module', async () => {
    @Module({
      imports: [EnvModule],
    })
    class FooModule {}

    const container = new Container();

    try {
      await container.addModule(FooModule);

      expect(true).to.false;
    } catch (err) {
      expect(err.code === EnvErrorCode.ImportModuleIncorectly).true;
    }
  });

  it('will throw error if user use EnvModule instead of EnvModule.config for exporting the module', async () => {
    @Module({
      exports: [EnvModule],
    })
    class FooModule {}

    const container = new Container();

    try {
      await container.addModule(FooModule);

      expect(true).to.false;
    } catch (err) {
      expect(err.code === EnvErrorCode.ImportModuleIncorectly).true;
    }
  });

  it('will throw error if "EnvModule.config" is invoked multiple times', async () => {
    try {
      @Module({
        exports: [
          EnvModule.config({ token: Env }),
          EnvModule.config({ token: Env }),
        ],
      })
      class FooModule {}

      expect(FooModule).to.false;
    } catch (err) {
      expect(err.code === EnvErrorCode.InvokeConfigMultipleTimes).true;
    }
  });

  it('can resolve env variables with specific token when exporting EnvModule', async () => {
    @Module({
      exports: [EnvModule.config({ token: Env })],
    })
    class FooModule {}

    const container = new Container();
    await container.addModule(FooModule);

    const env = await container.resolve<Env>(Env);

    expect(env.PORT).to.be.undefined;
  });

  it('can resolve env variables with specific token when importing EnvModule', async () => {
    @Injectable()
    class FooService {
      constructor(public env: Env) {}
    }

    @Module({
      imports: [EnvModule.config({ token: Env })],
      exports: [FooService],
    })
    class FooModule {}

    const container = new Container();
    await container.addModule(FooModule);

    const fooService = await container.resolve<FooService>(FooService);

    expect(fooService.env.PORT).to.be.undefined;
  });
});
