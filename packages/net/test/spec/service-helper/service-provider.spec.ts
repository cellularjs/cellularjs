import { afterEach } from 'mocha';
import {
  createNetWork,
  addServiceProviders,
  Cell,
  send,
  IRQ,
  clearNetwork,
} from '../../../src';
import { EditFooService, Session } from '../../fixture/serivce-helper';
import { ArticleCell } from '../../fixture/cells/article';

describe('Service helper - addServiceProviders()', () => {
  beforeEach(async () => {
    @Cell({
      listen: { EditFooService },
    })
    class LocalDriver {}

    await createNetWork([{ name: 'Provider', driver: LocalDriver }]);
  });

  afterEach(async () => {
    await clearNetwork();
  });

  it('can add provider for resolving service handler', async () => {
    addServiceProviders(EditFooService, [Session]);

    const irq = new IRQ({ to: 'Provider:EditFooService' });
    await send(irq, { throwOriginalError: true });
  });

  // TODO: add test case to describe service providers is global providers
  it('can work as provider from extend module', async () => {
    await createNetWork([{ name: 'Article', driver: ArticleCell }]);

    const irq = new IRQ({ to: 'Article:CreateArticle' });
    await send(irq, { throwOriginalError: true });
  });
});
