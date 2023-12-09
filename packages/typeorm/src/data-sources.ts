import { DataSource } from 'typeorm';
import { SourceName } from './type';

const _dataSources = new Map<SourceName, DataSource>();

export const DEFAULT_DATA_SOURCE = 'default';

export function setDataSource(name: SourceName, dataSource: DataSource) {
  _dataSources.set(name, dataSource);
}

/**
 * Get initialized data source by name
 * @see https://cellularjs.com/docs/how-to%20wiki/typeorm#multiple-data-sources
 */
export function getDataSource(
  name: SourceName = DEFAULT_DATA_SOURCE,
): DataSource | undefined {
  return _dataSources.get(name);
}

export function getAllDataSources() {
  return _dataSources;
}

/**
 * Close connection and remove the data source.
 */
export async function destroyDataSource(
  name: SourceName = DEFAULT_DATA_SOURCE,
) {
  const dataSource = getDataSource(name);

  if (!dataSource) return;

  await dataSource.destroy();
  _dataSources.delete(name);
}

/**
 * Close all connections and data sources.
 */
export async function destroyAllDataSource() {
  for (const sourceName of _dataSources.keys()) {
    await destroyDataSource(sourceName);
  }
}
