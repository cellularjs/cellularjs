import 'mocha';
import { expect } from 'chai';
import { Module, Container, OnInit, ModuleRef, Inject } from '../../../src';

describe('Module life cycle', () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  it('addModule can trigger onInit event', async () => {
    let called = false;

    @Module({})
    class ModuleWithOnInit implements OnInit {
      onInit() {
        called = true;
      }
    }

    await container.addModule(ModuleWithOnInit);

    expect(called).to.be.true;
  });

  it('addModule will wait for onInit until it is done', async () => {
    let called = false;

    @Module({})
    class ModuleWithOnInit implements OnInit {
      onInit() {
        return new Promise((resolve) =>
          setTimeout(() => {
            called = true;
            resolve(1);
          }, 10),
        );
      }
    }

    await container.addModule(ModuleWithOnInit);

    expect(called).to.be.true;
  });

  it('module class can get dependencies from current module meta', async () => {
    let value;

    @Module({
      providers: [{ token: 'key', useValue: 'value' }],
    })
    class YourModule {
      constructor(@Inject('key') resolvedValue) {
        value = resolvedValue;
      }
    }

    await container.addModule(YourModule);

    expect(value).to.eq('value');
  });

  it('module class can get current module ref', async () => {
    let value;

    @Module({
      providers: [{ token: 'key', useValue: 'value' }],
    })
    class ModuleWithOnInit implements OnInit {
      constructor(private moduleRef: ModuleRef) {}

      async onInit() {
        value = await this.moduleRef.resolve('key');
      }
    }

    await container.addModule(ModuleWithOnInit);

    expect(value).to.eq('value');
  });
});
