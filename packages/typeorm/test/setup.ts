import 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { destroyAllDataSource } from '../src';
import { getAllDataSources } from '../src/data-sources';

chai.use(chaiAsPromised);

afterEach(async () => {
  const dataSources = getAllDataSources();

  for (const [, dataSource] of dataSources) {
    const tableNames = dataSource.entityMetadatas
      .filter((entity) => !!entity.tableName)
      .map((entity) => `"${entity.tableName}"`)
      .join(', ');

    if (!tableNames.length) continue;

    await dataSource.query(`DROP TABLE IF EXISTS ${tableNames} CASCADE;`);
  }

  await destroyAllDataSource();
});
