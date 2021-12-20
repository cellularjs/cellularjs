import { ServiceHandler, IRS, Service, NextHandler } from '../../../src';

@Service({
  scope: 'publish',
})
export class Original implements ServiceHandler {
  handle() {
    return new IRS({ original: true });
  }
}

@Service()
export class Foo implements ServiceHandler {
  constructor(
    private nextHandler: NextHandler,
  ) { }

  async handle() {
    const rs = await this.nextHandler.handle();
    return new IRS({ ...rs.body, foo: true });
  }
}
@Service()
export class FooOverride implements ServiceHandler {
  constructor(
    private nextHandler: NextHandler,
  ) { }

  async handle() {
    const rs = await this.nextHandler.handle();

    return new IRS({ ...rs.body, foo: false });
  }
}

@Service()
export class Bar implements ServiceHandler {
  constructor(
    private nextHandler: NextHandler,
  ) { }

  async handle() {
    const rs = await this.nextHandler.handle();

    return new IRS({ ...rs.body, bar: true });
  }
}

export class Session {
  injected() { }
}

@Service({
  scope: 'publish',
})
export class EditFooService implements ServiceHandler {
  constructor(private session: Session) { }

  handle() {
    this.session.injected();
  }
}
