import 'mocha';
import { expect } from 'chai';
import { Module } from '@cellularjs/di';
import {
  createNetWork,
  getResolvedCell,
  NetErrorCode,
  send,
  IRQ,
  Cell,
} from '../../../src';
import { clearNetwork } from '../../../src/internal';
import {
  userCellCnf,
  bundlerCellCnf,
  bundlerCellWithDuplicateServiceCnf,
} from '../../fixture/share/network';

describe('Network - createNetwork:', () => {
  beforeEach(async () => {
    await clearNetwork();
  });

  it('can create network with cell configs', async () => {
    await createNetWork([userCellCnf]);

    const userCell = getResolvedCell('User');

    expect(userCell).to.not.undefined;
  });

  it('can not use duplicate cell name', async () => {
    try {
      await createNetWork([userCellCnf, userCellCnf]);

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(NetErrorCode.DuplicateCellName);
    }
  });

  it('can support bundler such as webpack', async () => {
    await createNetWork([bundlerCellCnf]);

    const irq = new IRQ({ to: 'Bundler:FooService' });
    const irs = await send(irq);

    expect(irs.body).to.equals('Bundler:FooService');
  });

  it('can throw error if service is duplicated', async () => {
    try {
      await createNetWork([bundlerCellWithDuplicateServiceCnf]);

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(NetErrorCode.DuplicateServiceHandlerName);
    }
  });

  it('will create cell one by one', async () => {
    // https://github.com/cellularjs/cellularjs/issues/83
    const expectedImportOrder = ['RealTypeOrmModule', 'CommonModule'];
    const actualImportOrder = [];

    function initialize() {
      @Module({})
      class RealTypeOrmModule {
        async onInit() {
          return new Promise((resovle) =>
            setTimeout(() => {
              actualImportOrder.push('RealTypeOrmModule');
              resovle(true);
            }),
          );
        }
      }
      return RealTypeOrmModule;
    }

    @Module({ exports: [initialize()] })
    class CommonModule {
      onInit() {
        actualImportOrder.push('CommonModule');
      }
    }

    @Cell({ imports: [CommonModule], listen: {} })
    class User {}

    @Cell({ imports: [CommonModule], listen: {} })
    class Article {}

    await createNetWork([
      { name: User.name, driver: User },
      { name: Article.name, driver: Article },
    ]);

    expect(expectedImportOrder).deep.equal(actualImportOrder);
  });
});
