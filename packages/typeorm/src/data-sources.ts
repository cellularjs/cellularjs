import { DataSource } from 'typeorm';

const dataSources = new Map<string, DataSource>();

export function setDataSource(name: string, dataSoure: DataSource) {
  if (dataSources.has(name))
    throw new Error(
      `DataSource with name "${name}" is exist.\n` +
        'Please make sure invoke TypeOrmModule.initialize with different name',
    );

  dataSources.set(name, dataSoure);
}

export function getDataSource(name = 'default') {
  if (!dataSources.has(name))
    throw new Error(
      `There is no DataSource(${name}). You need to initialize data source before adding entities or getDataSource.\n` +
        '(Example: https://github.com/great-elephant/cellularjs-realworld/tree/master/src/%24share)',
    );

  return dataSources.get(name);
}

export async function clearDataSrouce(name = 'default') {
  const dataSource = getDataSource(name);
  await dataSource.destroy();
  dataSources.delete(name);
}
