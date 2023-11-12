import 'mocha';
import { getUserRepository } from './01-initialize-parent.fix';

describe('01 Repository', () => {
  afterEach(async () => {
    // const dataSource = getDataSource();
    // await dataSource.getRepository(UserEntity).delete({});
    // await clearDataSrouce();
  });

  it('01 - Throw error if register entity before initializing data source', async () => {
    try {
      await getUserRepository();
    } catch (err) {
      console.log(err);
    }
    // chai.expect(getUserRepository()).to.eventually.be.rejected('')

    // await userRepo.save({ name: 'John Doe I' });
    // await userRepo.save({ name: 'John Doe II' });

    // console.log(await userRepo.findOneBy({ id: 1 }))
    // console.log(await userRepo.findOneBy({ id: 2 }))
    // expect(true).to.be.false;
  });
});
