import 'mocha';
import { expect } from 'chai';
import { env, EnvModule } from '../../src';
import { EnvErrorCode } from '../../src/errors';
import { clearParsedEnv } from '../../src/env.module';

describe('env() function', () => {
  beforeEach(() => {
    clearParsedEnv();
  });

  it('will throw error if env function is used before invoking EnvModule.config', async () => {
    expect(() => env())
      .to.throw()
      .with.property('code', EnvErrorCode.UseEnvFuncBeforeImport);
  });

  it('can get environment variable after EnvModule.config is invoked', async () => {
    EnvModule.config({ token: '' });

    expect(env()).to.eqls({});
  });
});
