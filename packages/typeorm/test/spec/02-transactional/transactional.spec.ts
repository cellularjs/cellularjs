import 'mocha';
import { getDataSource } from '../../../src';
import { UserEntity, getUserRepository } from './01-initialize-parent.fix';
import { IRQ, send } from '@cellularjs/net';
import { clearDataSrouce } from '../../../src/data-sources';

describe('01 Repository', () => {
  afterEach(async () => {
    const dataSource = getDataSource();
    await dataSource.getRepository(UserEntity).delete({});
    await clearDataSrouce();
  });

  it('01 - Must initialize parent module first before using forFeature', async () => {
    await getUserRepository();

    try {
      await send(new IRQ({ to: 'User:RegisterCmd' }, { shouldThrow: true }));
    } catch (err) {
      console.log('err', err);
    }

    const xx1 = await getDataSource().getRepository(UserEntity).find({});
    console.log('xxx', xx1);
    // await userRepo.save({ name: 'John Doe I' });
    // await userRepo.save({ name: 'John Doe II' });

    // console.log(await userRepo.findOneBy({ id: 1 }))
    // console.log(await userRepo.findOneBy({ id: 2 }))
    // expect(true).to.be.false;
  });
});
