import {
  Injectable,
  Optional,
  addProxy,
  ProxyHandler,
  ProxyContext,
} from '@cellularjs/di';
import { EntityTarget } from 'typeorm';
import { getDataSource } from './data-sources';
import { QueryRunner } from './typing';

export const Repository = (entity: EntityTarget<any>) => (aClass) => {
  addProxy(aClass, {
    proxy: RepositoryProxy,
    meta: { entity },
  });

  Injectable()(aClass);

  return aClass;
};

interface RepositoryProxyMeta {
  entity: EntityTarget<any>;
}

class RepositoryProxy implements ProxyHandler {
  constructor(
    @Optional()
    private queryRunner: QueryRunner | undefined,
    private ctx: ProxyContext<RepositoryProxyMeta>,
  ) {}

  async handle() {
    const { queryRunner, ctx } = this;

    const repositoryFactory = queryRunner?.manager || getDataSource();
    const typeOrmRepository = repositoryFactory.getRepository(ctx.meta.entity);

    return new Proxy(await ctx.next(), {
      get(target, prop) {
        return typeOrmRepository[prop] || target[prop];
      },
    });
  }
}
