import 'mocha';
import { expect } from 'chai';
import { Container, Module, clearModuleMap, OnInit } from '../../../src';

describe('clearModuleMap():', () => {
  it('without clearModuleMap, imported module will be cached', async () => {
    let call = 0;

    @Module({})
    class FooModule implements OnInit {
      onInit() {
        call++;
      }
    }

    const container = new Container();
    await container.addModule(FooModule);
    await container.addModule(FooModule);
    await container.addModule(FooModule);

    expect(call).to.be.eq(1);
  });

  it('can remove previous imported module from module map', async () => {
    let call = 0;

    @Module({})
    class FooModule implements OnInit {
      onInit() {
        call++;
      }
    }

    const container = new Container();
    await container.addModule(FooModule);
    clearModuleMap();
    await container.addModule(FooModule);
    clearModuleMap();
    await container.addModule(FooModule);

    expect(call).to.be.eq(3);
  });
});
