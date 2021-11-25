import { Container, GenericProvider } from '@cellularjs/di';
import { LOCAL_DRIVER, CellConfig, CellMeta } from '..';
import { Errors } from '../internal';
import { ResolvedDriver, ServiceHandlerMap } from '../type';
import { getCellMeta, scanForServiceHandler, scanForProviders } from '../utils';

export async function resolveDrivers(cellConfig: CellConfig) {
  const drivers = new Map<string, ResolvedDriver>();

  if (typeof cellConfig.driver !== 'object') {
    const driver = await resolveDriver(cellConfig, cellConfig.driver);

    return drivers.set(LOCAL_DRIVER, driver);
  }

  const resolveDriverTasks = Object.keys(cellConfig.driver).map(async driver => {
    const driverClass = cellConfig.driver[driver];

    drivers.set(driver, await resolveDriver(cellConfig, driverClass));
  });

  await Promise.all(resolveDriverTasks);

  return drivers;
}

async function resolveDriver(cellCnf: CellConfig, driverClass): Promise<ResolvedDriver> {
  const driverMeta = getCellMeta(driverClass);
  if (!driverMeta) {
    throw Errors.InvalidDriverClass(cellCnf.name);
  }

  const listener = resolveListener(driverMeta, cellCnf);
  const driverContainer = await createDriverContainer(driverMeta);

  driverContainer.addProviders(Array.from(listener.values()));

  return {
    listener,
    container: driverContainer,
  };
}

function resolveListener(cellMeta: CellMeta, cellCnf: CellConfig): ServiceHandlerMap {
  if (typeof cellMeta.listen === 'object') {
    return new Map(Object.entries(cellMeta.listen));
  }

  // string will be treated as a path to folder containing event handler.

  const eventHandlers = {};
  scanForServiceHandler(cellMeta.listen, cellCnf, eventHandlers);

  return new Map(Object.entries(eventHandlers));
}

async function createDriverContainer(driverMeta: CellMeta): Promise<Container> {
  let providers = driverMeta.providers
    .filter(provider => typeof provider !== 'string') as GenericProvider[];

  driverMeta.providers.forEach(provider => {
    if (typeof provider !== 'string') {
      return;
    }

    providers = providers.concat(scanForProviders(provider));
  })

  const container = new Container();
  container.addProviders(providers);
  container.addModules(driverMeta.imports);

  return container;
}
