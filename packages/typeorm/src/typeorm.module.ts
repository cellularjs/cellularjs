import { Module, ExtModuleMeta, OnInit } from '@cellularjs/di';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConnectionMetadataBuilder } from 'typeorm/connection/ConnectionMetadataBuilder';
import {
  DEFAULT_DATA_SOURCE,
  getDataSource,
  setDataSource,
} from './data-sources';
import { SourceName, Entity } from './type';
import { Errors } from './errors';

type ForFeatureOpt = {
  /**
   * Data source name.
   */
  source?: SourceName;
  entities: Entity[];
};

@Module({})
export class TypeOrmModule {
  /**
   * Initialize a data source and it can be used globally. You can create multiple data sources,
   * each with a unique name.
   *
   * By default data source's name will be "default".
   *
   * Eg:
   * ```ts
   * import { getDataSource } from '@cellularjs/typeorm';
   *
   * ⁣@Module({
   *   exports: [
   *     TypeOrmModule.initialize({
   *       name: 'custom_name',
   *       ...
   *     })
   *   ]
   * })
   * export class CommonModule {}
   *
   * getDataSource('custom_name');
   * ```
   *
   * ---
   *
   *  With your data source ready, use TypeOrmModule.forFeature to register your entities with it.:
   * ```ts
   * ⁣@Cell({
   *   imports: [
   *     TypeOrmModule.forFeature({
   *       source: 'custom_name', // optional
   *       entities: [UserEntity]
   *     })
   *   ]
   * })
   * export class UserCell {}
   * ```
   */
  static initialize(options: DataSourceOptions) {
    return getRealTypeOrmModule(options);
  }

  /**
   * Add entities into a data source.
   *
   * ```ts
   * // Use "default" data source
   * TypeOrmModule.forFeature({
   *   entities: []
   * })
   *
   * // Or, explicitly use other data source
   *
   * TypeOrmModule.forFeature({
   *   source: 'other_data_source_name',
   *   entities: []
   * })
   * ```
   *
   * _**NOTE**: You need to initialize data source with `TypeOrmModule.initialize` first._
   */
  static forFeature(opts: ForFeatureOpt): ExtModuleMeta {
    return {
      extModule: TypeOrmModule,
      exports: [getRealTypeOrmForFeature(opts)],
    };
  }
}

function getRealTypeOrmModule(options: DataSourceOptions) {
  @Module({})
  class RealTypeOrmModule implements OnInit {
    async onInit() {
      const opts = options;

      const sourceName = opts.name || DEFAULT_DATA_SOURCE;

      if (getDataSource(sourceName))
        throw Errors.DuplicateSourceName(sourceName);

      const dataSource = await new DataSource(opts).initialize();
      setDataSource(sourceName, dataSource);
    }
  }

  return RealTypeOrmModule;
}

function getRealTypeOrmForFeature({ entities, source }: ForFeatureOpt) {
  @Module({})
  class RealTypeOrmForFeatureModule implements OnInit {
    async onInit() {
      const sourceName = source || DEFAULT_DATA_SOURCE;
      const dataSource = getDataSource(sourceName);

      if (!dataSource) {
        throw Errors.NoDataSource(sourceName);
      }

      const metadataBuilder = new ConnectionMetadataBuilder(dataSource);
      const entityMetadatas = await metadataBuilder.buildEntityMetadatas(
        entities,
      );
      dataSource.entityMetadatas.push(...entityMetadatas);

      // For typeorm >= 0.3.14
      dataSource.entityMetadatasMap &&
        entityMetadatas.forEach((entityMeta) => {
          dataSource.entityMetadatasMap.set(entityMeta.target, entityMeta);
        });

      if (dataSource.options.synchronize) {
        await dataSource.synchronize();
      }
    }
  }

  return RealTypeOrmForFeatureModule;
}
