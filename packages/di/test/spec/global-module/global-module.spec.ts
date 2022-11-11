import 'mocha';
import { expect } from 'chai';
import {
  Container,
  Injectable,
  Inject,
  Module,
  ExtModuleMeta,
  clearModuleMap,
  setGlobalProviders,
  setGlobalModules,
  DiErrorCode,
} from '../../../src';

describe('Global module/provider specification:', () => {
  beforeEach(clearModuleMap);

  it('can setting global providers with setGlobalProviders', async () => {
    @Injectable()
    class Tree {
      constructor(@Inject('name') public name) {}
    }

    const container = new Container();
    await container.addProvider(Tree);

    // Case 1: before setting global provider => invalid.
    try {
      await container.resolve<Tree>(Tree);
      expect(true).to.be.false;
    } catch (err) {
      expect(err.code).to.eql(DiErrorCode.NoProviderForToken);
    }

    // Case 2: after setting global provider => valid.
    await setGlobalProviders([{ token: 'name', useValue: 'Banyan' }]);

    const tree = await container.resolve<Tree>(Tree);
    expect(tree.name).to.equal('Banyan');
  });

  it('global provider has lower priority than normal providers', async () => {
    class Tree {
      constructor(@Inject('name') public name) {}
    }

    await setGlobalProviders([{ token: 'name', useValue: 'Orchid' }]);

    // Case 1:
    const container1 = new Container();
    await container1.addProviders([
      { token: Tree, useClass: Tree },
      { token: 'name', useValue: 'Sunflower' },
    ]);

    const tree1 = await container1.resolve<Tree>(Tree);
    expect(tree1.name).to.equal('Sunflower');

    // Case 2:
    const container2 = new Container();
    await container2.addProvider(Tree);

    const tree2 = await container2.resolve<Tree>(Tree);
    expect(tree2.name).to.equal('Orchid');
  });

  it('global provider has lower priority than ref module(~ extend module)', async () => {
    class Tree {
      constructor(@Inject('name') public name) {}
    }

    await setGlobalProviders([{ token: 'name', useValue: 'Rosewood' }]);

    @Module({ exports: [Tree] })
    class Forest {
      static extend(): ExtModuleMeta {
        return {
          extModule: Forest,
          providers: [{ token: 'name', useValue: 'Oak' }],
        };
      }
    }

    // Case 1:
    const container1 = new Container();
    await container1.addModule(Forest.extend());

    const tree1 = await container1.resolve<Tree>(Tree);
    expect(tree1.name).to.equal('Oak');

    // Case 2: if there is no matched extModule provider,
    // it will try to get global provider.
    const container2 = new Container();
    await container2.addModule(Forest);

    const tree2 = await container2.resolve<Tree>(Tree);
    expect(tree2.name).to.equal('Rosewood');
  });

  it('can add a module into global module and use it with setGlobalModules', async () => {
    class Tree {
      constructor(@Inject('name') public name) {}
    }

    @Module({
      providers: [{ token: 'name', useValue: 'Pine' }],
      exports: [Tree],
    })
    class Forest {}

    await setGlobalModules([Forest]);

    const container = new Container();
    const tree = await container.resolve<Tree>(Tree);

    expect(tree.name).to.equal('Pine');
  });
});
