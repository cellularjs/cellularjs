import { Module, ExtModuleMeta, OnInit } from '@cellularjs/di';
import { getLogger } from '@cellularjs/logger';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConnectionMetadataBuilder } from 'typeorm/connection/ConnectionMetadataBuilder';
import { getDataSource, setDataSource } from './data-sources';
import { Entity } from './typing';

@Module({})
export class TypeOrmModule {
  static initialize(options: DataSourceOptions) {
    return getRealTypeOrmModule(options);
  }

  static forFeature(entities: Entity[]): ExtModuleMeta {
    return {
      extModule: TypeOrmModule,
      exports: [getRealTypeOrmForFeature(entities)],
    };
  }
}

function getRealTypeOrmForFeature(entities: Entity[]) {
  @Module({})
  class RealTypeOrmForFeatureModule implements OnInit {
    async onInit() {
      const dataSource = getDataSource();

      const metadataBuilder = new ConnectionMetadataBuilder(dataSource);
      const entityMetadatas = await metadataBuilder.buildEntityMetadatas(
        entities,
      );

      dataSource.entityMetadatas.push(...entityMetadatas);

      // For typeorm >= 0.3.17
      dataSource.entityMetadatasMap &&
        entityMetadatas.forEach((entityMeta, idx) => {
          dataSource.entityMetadatasMap.set(entities[idx], entityMeta);
        });

      if (dataSource.options.synchronize) {
        await dataSource.synchronize();
      }

      const logger = getLogger(TypeOrmModule.name);
      logger.info(`${entities.map((e) => e.name).join(', ')} added`);
    }
  }

  return RealTypeOrmForFeatureModule;
}

function getRealTypeOrmModule(options: DataSourceOptions) {
  @Module({})
  class RealTypeOrmModule implements OnInit {
    async onInit() {
      const logger = getLogger(TypeOrmModule.name);
      const opts = options;

      try {
        const dataSource = await new DataSource(opts).initialize();
        const dataSourceName = opts.name || 'default';
        setDataSource(dataSourceName, dataSource);

        logger.info(`DataSource(${dataSourceName}) has been initialized`);
      } catch (err) {
        logger.error(`failed to connect to DB\n${err.stack || err}`);
        throw err;
      }
    }
  }

  return RealTypeOrmModule;
}
