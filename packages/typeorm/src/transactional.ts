import { Injectable } from '@cellularjs/di';
import {
  addServiceProviders,
  addServiceProxies,
  NextHandler,
  ServiceHandler,
} from '@cellularjs/net';
import { ReplicationMode } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';
import { DEFAULT_DATA_SOURCE, getDataSource } from './data-sources';
import { SourceName, QueryRunner } from './type';
import { Errors } from './errors';
import { getDefaultCatch, TransactionalCatch, TxContext } from './tx-catch';

export class TransactionalOptions {
  catch?: TransactionalCatch;
  replication?: ReplicationMode;
  /**
   * Default: `DEFAULT_DATA_SOURCE`.
   */
  source?: SourceName;
  isolation?: IsolationLevel;
}

/**
 * __*Description:*__
 * The `Transactional` decorator is intended for a single transaction per
 * request(or [service](https://cellularjs.com/docs/foundation/net/service)).
 * It works by replacing the repository's query runner during dependency injection.
 *
 * __*Note:*__
 * 1. Currently, the `Transactional` decorator is for relational database only.
 * 2. The `Transactional` only works with
 * [TypeORM's Data Mapper](https://typeorm.io/active-record-data-mapper#what-is-the-data-mapper-pattern).
 * There seems to be no support for transactions when using active record,
 * [read more](https://github.com/typeorm/typeorm/issues/4401).
 *
 * __*Examples:*__
 * Example 1: Defining entity, repository, and using the `Transactional` decorator.
 *
 * _First, you need to define the entity and its repository._
 * ```ts
 * // user.ts
 * import { Entity, Repository as TypeOrmRepository } from 'typeorm';
 * import { Service, ServiceHandler } from '@cellularjs/net';
 * import { Repository } from '@cellularjs/typeorm';
 *
 * ⁣@Entity()
 * export class UserEntity {
 *   // ...
 * }
 *
 * export interface UserRepository extends TypeOrmRepository {}
 *
 * ⁣@Repository({ entity: UserEntity })
 * export class UserRepository {}
 * ```
 *
 * _Second, register the entity into the data source with `TypeOrmModule.forFeature`._
 * ```ts
 * // cell.ts
 * import { Cell } from '@cellularjs/net';
 * import { TypeOrmModule } from '@cellularjs/typeorm';
 *
 * ⁣@Cell({
 *   exports: [
 *     TypeOrmModule.forFeature({
 *       // source: 'ds_name',
 *       entities: [UserEntity],
 *     }),
 *   ],
 * })
 * export class UserCell {}
 * ```
 *
 * _Finally, you can start using the repository in your code. The query runner
 * that is internally used by the repository is now managed with `Transactional`._
 * ```ts
 * // rename.cmd.ts
 * import { UserRepository } from './user';
 *
 * ⁣@Transactional()
 * ⁣@Service({ scope: 'publish' })
 * export class RenameCmd implements ServiceHandler {
 *   constructor(
 *     private userRepository: UserRepository,
 *   ) {}
 *
 *   async handle() {
 *     const user = await this.userRepository.findOneBy({ id: 1 })
 *     user.name = 'X'
 *
 *     await this.userRepository.save(user);
 *     // ...
 *   }
 * }
 * ```
 */
export const Transactional = (options?: TransactionalOptions) => (aClass) => {
  addServiceProxies(aClass, [TransactionalProxy]);
  addServiceProviders(aClass, [
    {
      token: TransactionalOptions,
      useValue: options,
    },
  ]);

  return aClass;
};

@Injectable()
class TransactionalProxy implements ServiceHandler {
  private ctx: TxContext = {};

  constructor(
    private nextHandler: NextHandler,
    private options?: TransactionalOptions,
  ) {}

  async handle() {
    const { options, nextHandler } = this;
    const sourceName = options?.source || DEFAULT_DATA_SOURCE;
    const dataSource = getDataSource(sourceName);

    if (!dataSource) throw Errors.NoDataSource(sourceName);

    const queryRunner = dataSource.createQueryRunner(options?.replication);

    try {
      await queryRunner.startTransaction(options?.isolation);

      const extModule = nextHandler.getExtModule();

      if (extModule.has(QueryRunner)) {
        extModule.remove(QueryRunner);
      }

      await extModule.addProvider({
        token: QueryRunner,
        useValue: queryRunner,
      });

      const result = await nextHandler.handle();

      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      const catchCb = options?.catch || getDefaultCatch();
      if (!catchCb) {
        throw error;
      }

      return await catchCb({
        service: this,
        ctx: this.ctx,
        error,
      });
    } finally {
      await queryRunner.release();
    }
  }
}
