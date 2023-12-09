/* eslint-disable indent */

import { assert, expect } from 'chai';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Repository as TypeOrmRepository,
} from 'typeorm';
import { Module, DiErrorCode } from '@cellularjs/di';
import {
  Cell,
  createNetWork,
  clearNetwork,
  Service,
  IRQ,
  send,
  IRS,
} from '@cellularjs/net';
import {
  QueryRunner,
  Repository,
  Transactional,
  TypeOrmModule,
  getDataSource,
  setDefaultCatch,
  TypeOrmErrorCode,
  DEFAULT_DATA_SOURCE,
} from '../../src';
import { clearDefaultCatch } from '../../src/tx-catch';
import { PG_URL } from '../config';
import { NetHelper } from '../net-helper';

/*************************************
 * START FIXTURE
 *************************************/
// user.dal
@Entity()
class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;
}

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
interface UserRepository extends TypeOrmRepository<UserEntity> {}

@Repository({ entity: UserEntity })
class UserRepository {}

@Module({
  exports: [
    TypeOrmModule.initialize({
      type: 'postgres',
      url: PG_URL,
      synchronize: true,
    }),
  ],
})
class CommonModule {}

@Cell({
  providers: [UserRepository],
  imports: [CommonModule, TypeOrmModule.forFeature({ entities: [UserEntity] })],
  listen: {},
})
class User {}

/*************************************
 * END FIXTURE
 *************************************/

describe('3. Transactional decorator', () => {
  describe('Basic usage', () => {
    beforeEach(async () => {
      await createNetWork([{ name: 'User', driver: User }]);
    });

    afterEach(async () => {
      await clearNetwork();
    });

    it('rollback if error occur', async () => {
      let newUser: UserEntity;
      @Transactional()
      @Service({ scope: 'publish' })
      class RegisterUserCmd {
        constructor(private userRepository: UserRepository) {}

        async handle() {
          const { userRepository } = this;

          newUser = await userRepository.save({ name: 'John Doe' });

          throw new IRS({ status: 400 });
        }
      }

      await NetHelper.addServiceHandler('User', RegisterUserCmd);

      await assert
        .isRejected(send(new IRQ({ to: 'User:RegisterUserCmd' })))
        .then((irs: any) => {
          expect(irs.header.status).equal(400);
        });

      const savedData = await getDataSource()
        .getRepository(UserEntity)
        .findOneBy({ id: newUser.id });

      expect(savedData).to.be.null;
    });

    it('commit if service handler success', async () => {
      let newUser: UserEntity;

      @Transactional()
      @Service({ scope: 'publish' })
      class RegisterUserCmd {
        constructor(private userRepository: UserRepository) {}

        async handle() {
          const { userRepository } = this;

          newUser = await userRepository.save({ name: 'John Doe' });
        }
      }

      await NetHelper.addServiceHandler('User', RegisterUserCmd);

      await send(new IRQ({ to: 'User:RegisterUserCmd' }));

      const savedUser = await getDataSource()
        .getRepository(UserEntity)
        .findOneBy({ id: newUser.id });

      expect(savedUser).eqls(newUser);
    });

    it('can config transaction isolation level', async () => {
      @Transactional({ isolation: 'SERIALIZABLE' })
      @Service({ scope: 'publish' })
      class RegisterUserCmd {
        async handle() {}
      }

      await NetHelper.addServiceHandler('User', RegisterUserCmd);

      await send(new IRQ({ to: 'User:RegisterUserCmd' }));
    });

    it('can specify replication', async () => {
      @Transactional({ replication: 'master' })
      @Service({ scope: 'publish' })
      class RegisterUserCmd {
        async handle() {}
      }

      await NetHelper.addServiceHandler('User', RegisterUserCmd);

      await send(new IRQ({ to: 'User:RegisterUserCmd' }));
    });

    it('can specify data source', async () => {
      @Transactional({ source: DEFAULT_DATA_SOURCE })
      @Service({ scope: 'publish' })
      class RegisterUserCmd {
        async handle() {}
      }

      await NetHelper.addServiceHandler('User', RegisterUserCmd);

      await send(new IRQ({ to: 'User:RegisterUserCmd' }));
    });

    it('throw error if data source is not found', async () => {
      @Transactional({ source: 'not_exist' })
      @Service({ scope: 'publish' })
      class RegisterUserCmd {
        async handle() {}
      }

      await NetHelper.addServiceHandler('User', RegisterUserCmd);

      await assert
        .isRejected(
          send(new IRQ({ to: 'User:RegisterUserCmd' }), {
            throwOriginalError: true,
          }),
        )
        .then((err: any) => {
          expect(err.code).to.equal(TypeOrmErrorCode.NoDataSource);
        });
    });
  });

  describe('Error handling', () => {
    beforeEach(async () => {
      await createNetWork([{ name: 'User', driver: User }]);
    });

    afterEach(async () => {
      clearDefaultCatch();
      await clearNetwork();
    });

    it('not allow to set multilpe default catch', () => {
      setDefaultCatch(async () => {});
      expect(() => setDefaultCatch(async () => {})).to.throw();
    });

    it('set default catch as global catch', async () => {
      let tryCount = 0;
      setDefaultCatch(async ({ ctx, error, service }) => {
        ctx.try ||= 0;
        ctx.try++;
        tryCount++;

        if (ctx.try > 1) throw error;

        return await service.handle();
      });

      @Transactional()
      @Service({ scope: 'publish' })
      class RegisterUserCmd {
        constructor(private userRepository: UserRepository) {}

        async handle() {
          const { userRepository } = this;

          await userRepository.save({ name: 'John Doe' });

          throw new IRS({ status: 400 });
        }
      }

      await NetHelper.addServiceHandler('User', RegisterUserCmd);

      await assert
        .isRejected(send(new IRQ({ to: 'User:RegisterUserCmd' })))
        .then((irs: any) => {
          expect(irs.header.status).equal(400);
        });

      expect(tryCount).eq(2);
    });

    it('custom error handler for a service with catch property', async () => {
      let tryCount = 0;
      let newUser: UserEntity;
      const txCatch = async ({ ctx, error, service }) => {
        ctx.try ||= 0;
        ctx.try++;
        tryCount++;

        if (ctx.try > 1) throw error;

        return await service.handle();
      };

      setDefaultCatch(async () => {
        throw new Error('Do nothing');
      });

      @Transactional({ catch: txCatch })
      @Service({ scope: 'publish' })
      class RegisterUserCmd {
        constructor(private userRepository: UserRepository) {}

        async handle() {
          const { userRepository } = this;

          newUser = await userRepository.save({ name: 'John Doe' });

          if (tryCount < 1) throw new IRS({ status: 400 });
        }
      }

      await NetHelper.addServiceHandler('User', RegisterUserCmd);

      await send(new IRQ({ to: 'User:RegisterUserCmd' }));

      const savedUser = await getDataSource()
        .getRepository(UserEntity)
        .findOneBy({ id: newUser.id });

      expect(savedUser).eqls(newUser);
      expect(tryCount).eq(1);
    });
  });

  describe('Access QueryRunner', () => {
    beforeEach(async () => {
      await createNetWork([{ name: 'User', driver: User }]);
    });

    afterEach(async () => {
      await clearNetwork();
    });

    it('can not get query runner if Transactional decorator is not used', async () => {
      @Service({ scope: 'publish' })
      class RegisterUserCmd {
        constructor(public _queryRunner: QueryRunner) {}
        async handle() {}
      }

      await NetHelper.addServiceHandler('User', RegisterUserCmd);

      await assert
        .isRejected(
          send(new IRQ({ to: 'User:RegisterUserCmd' }), {
            throwOriginalError: true,
          }),
        )
        .then((err: any) => {
          expect(err.code).equal(DiErrorCode.NoProviderForToken);
        });
    });

    it('can get query runner created by Transactional decorator', async () => {
      let queryRunner: QueryRunner;

      @Transactional()
      @Service({ scope: 'publish' })
      class RegisterUserCmd {
        constructor(_queryRunner: QueryRunner) {
          queryRunner = _queryRunner;
        }

        async handle() {}
      }

      await NetHelper.addServiceHandler('User', RegisterUserCmd);
      await send(new IRQ({ to: 'User:RegisterUserCmd' }));

      expect(queryRunner.isReleased).to.be.true;
    });
  });
});
