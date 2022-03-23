import { Cell, Service, ServiceHandler, IRQ, IRS } from '@cellularjs/net';
import { initNetWorker, transfer } from '../../src';
import { WorkerErrorCode } from '../../src/internal';

@Service({ scope: 'publish' })
class BarService implements ServiceHandler {
  handle() {
    return 'BarService';
  }
}

@Service({ scope: 'publish' })
class ErrorService implements ServiceHandler {
  handle() {
    throw new IRS({ status: 500 }, 'ErrorService');
  }
}

@Service({ scope: 'publish' })
class UserTransfer implements ServiceHandler {
  async handle() {
    try {
      await transfer(new IRQ({ to: 'Any:Any' }));
    } catch (err) {
      return err.code === WorkerErrorCode.TransferFromChildThread;
    }
  }
}

@Cell({
  listen: { BarService, ErrorService, UserTransfer },
})
class FooCell {}

initNetWorker([
  {
    driver: FooCell,
    name: 'Foo',
  },
]);
