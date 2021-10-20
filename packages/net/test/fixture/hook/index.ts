import { Inject } from '@cellularjs/di'
import { ServiceHandler, CellularIRS, CLL_NET_HANDLER, Service } from '../../../src';

@Service({
  scope: 'public',
})
export class Original implements ServiceHandler {
  handle() {
    return new CellularIRS({ original: true });
  }
}

@Service()
export class Foo implements ServiceHandler {
  constructor(
    @Inject(CLL_NET_HANDLER) private handler: ServiceHandler,
  ) { }

  async handle() {
    const rs = await this.handler.handle();

    return new CellularIRS({ ...rs.body, foo: true });
  }
}
@Service()
export class FooOverride implements ServiceHandler {
  constructor(
    @Inject(CLL_NET_HANDLER) private handler: ServiceHandler,
  ) { }

  async handle() {
    const rs = await this.handler.handle();

    return new CellularIRS({ ...rs.body, foo: false });
  }
}

@Service()
export class Bar implements ServiceHandler {
  constructor(
    @Inject(CLL_NET_HANDLER) private handler: ServiceHandler,
  ) { }

  async handle() {
    const rs = await this.handler.handle();

    return new CellularIRS({ ...rs.body, bar: true });
  }
}

export class Session { }

@Service({
  scope: 'public',
})
export class EditFooService implements ServiceHandler {
  constructor(public session: Session) { }

  handle() {
    return new CellularIRS();
  }
}
