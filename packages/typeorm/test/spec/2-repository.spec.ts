/* eslint-disable indent */

import { expect } from 'chai';
import {
  Entity,
  PrimaryColumn,
  Repository as TypeOrmRepository,
} from 'typeorm';
import { Container, Module } from '@cellularjs/di';
import { Repository, TypeOrmModule } from '../../src';
import { PG_URL } from '../config';

@Entity()
class UserEntity {
  @PrimaryColumn()
  id: number;
}

describe('2. Repository decorator', () => {
  let container: Container;

  beforeEach(async () => {
    container = new Container();

    @Module({
      exports: [
        TypeOrmModule.initialize({
          type: 'postgres',
          url: PG_URL,
        }),
        TypeOrmModule.forFeature({
          entities: [UserEntity],
        }),
      ],
    })
    class CommonModule {}

    await container.addModule(CommonModule);
  });

  it("can create TypeORM's repository", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-empty-interface */
    interface UserRepository extends TypeOrmRepository<UserEntity> {}

    @Repository({ entity: UserEntity })
    class UserRepository {}

    await container.addProvider(UserRepository);
    const userRepository = await container.resolve<UserRepository>(
      UserRepository,
    );

    expect(userRepository.target).equal(UserEntity);
  });

  it('can create repository with custom method', async () => {
    /* eslint-disable-next-line @typescript-eslint/no-empty-interface */
    interface UserRepository extends TypeOrmRepository<UserEntity> {}

    @Repository({ entity: UserEntity })
    class UserRepository {
      getTarget() {
        return this.target;
      }
    }

    await container.addProvider(UserRepository);
    const userRepository = await container.resolve<UserRepository>(
      UserRepository,
    );

    expect(userRepository.getTarget()).equal(UserEntity);
  });
});
