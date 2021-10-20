import 'mocha';
import { expect } from 'chai';
import { Container, DiErrorCode } from '../../../src';
import { JwtModule } from '../../fixture/pkg/jwt/jwt.module';
import { Md2Service } from '../../fixture/pkg/jwt/md2.service';
import { Md5Service } from '../../fixture/pkg/jwt/md5.service';
import { Sha1Service } from '../../fixture/pkg/jwt/sha1.service';

describe('Provider - useModule', () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  it('can resolve provider from other module without importing into container', async () => {
    container.addProviders([
      { token: Md2Service, useModule: JwtModule },
      { token: Md5Service, useModule: JwtModule },
    ]);

    const [md2Service, md5Service] = await Promise.all([
      container.resolve<Md2Service>(Md2Service),
      container.resolve<Md5Service>(Md5Service),
    ]);

    md2Service.hash('run without crash');
    md5Service.hash('run without crash');

    const errorFunc = () => container.resolve(Sha1Service);

    expect(errorFunc)
      .to.throw()
      .with.property('code', DiErrorCode.NoProviderForToken);
  });

  it('can not use invalid module as argument for useModule', () => {
    const errorFunc = () => container.addProviders([
      { token: Md2Service, useModule: Md2Service },
    ]);

    expect(errorFunc)
      .to.throw()
      .with.property('code', DiErrorCode.InvalidModuleClass);
  });
})