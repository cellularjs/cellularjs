import {
  Injectable,
  Optional,
  addProxy,
  ProxyHandler,
  ProxyContext,
} from '@cellularjs/di';
import { EntityTarget } from 'typeorm';
import { DEFAULT_DATA_SOURCE, getDataSource } from './data-sources';
import { SourceName, QueryRunner } from './type';

/**
 * __*Description:*__
 * The `Repository` decorator help you working with
 * [TypeORM's Data Mapper](https://typeorm.io/active-record-data-mapper#what-is-the-data-mapper-pattern) more easily.
 * Under the hood, it utilizes
 * [DI proxy](https://cellularjs.com/docs/foundation/dependency-injection/basic-usage#3-proxy)
 * to facilitate the creation of TypeORM repositories.
 *
 * __*Examples:*__
 * - _Example 1: defining entity, repository, and using it._
 *   ```ts
 *   // user.ts
 *   import { Entity, PrimaryGeneratedColumn, Column, Repository as TypeOrmRepository } from 'typeorm';
 *   import { Repository } from '@cellularjs/typeorm';
 *
 *   ⁣@Entity()
 *   class UserEntity {
 *     ⁣@PrimaryGeneratedColumn('uuid')
 *     id: string;
 *
 *     ⁣@Column()
 *     name: string;
 *   }
 *
 *   export interface UserRepository extends TypeOrmRepository<UserEntity> { }
 *
 *   ⁣@Repository({ entity: UserEntity })
 *   export class UserRepository { }
 *
 *   // list-user.qry.ts
 *   import { Service, ServiceHandler } from '@cellularjs/net';
 *   import { UserRepository } from './user';
 *
 *   ⁣@Service({ scope: 'publish' })
 *   export class ListUserQry implements ServiceHandler {
 *     constructor(
 *       private userRepository: UserRepository,
 *     ) {}
 *
 *     async handle() {
 *       // this.userReposotiry.find(...)
 *     }
 *   }
 *   ```
 * - _Example 2: add custom method to repository._
 *   ```ts
 *   export interface UserRepository extends TypeOrmRepository<UserEntity> { }
 *
 *   ⁣@Repository({ entity: UserEntity })
 *   export class UserRepository {
 *     async findByName(name: string) {
 *       return this.findOneBy({ name });
 *     }
 *   }
 *   ```
 */
export const Repository = (opts: RepositoryProxyMeta) => (aClass) => {
  addProxy(aClass, {
    proxy: RepositoryProxy,
    meta: opts,
  });

  // mark this class as injectable so it can be autoload.
  Injectable()(aClass);

  return aClass;
};

type RepositoryProxyMeta = {
  entity: EntityTarget<unknown>;
  source?: SourceName;
};

class RepositoryProxy implements ProxyHandler {
  constructor(
    @Optional()
    private queryRunner: QueryRunner | undefined,
    private ctx: ProxyContext<RepositoryProxyMeta>,
  ) {}

  async handle() {
    const { queryRunner, ctx } = this;
    const { meta } = ctx;
    const repositoryFactory =
      queryRunner?.manager || getDataSource(meta.source || DEFAULT_DATA_SOURCE);
    const typeOrmRepository = repositoryFactory.getRepository(meta.entity);
    const repositoryInstance = await ctx.next();

    return new Proxy(repositoryInstance, {
      get(target, prop) {
        return typeOrmRepository[prop] || target[prop];
      },
    });
  }
}
