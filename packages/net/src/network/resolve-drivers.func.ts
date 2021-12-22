import { Container, GenericProvider } from '@cellularjs/di';
import { LOCAL_DRIVER, CellConfig, CellMeta } from '..';
import { Errors } from '../internal';
import { ResolvedDriver, ServiceHandlerMap } from '../type';
import {
  getCellMeta, scanForServiceHandler, registServiceHandlerFromModules,
  scanDirForProviders, scanModulesForProviders,
} from '../utils';

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

  await driverContainer.addProviders(Array.from(listener.values()));

  return {
    listener,
    container: driverContainer,
  };
}

function resolveListener(cellMeta: CellMeta, cellCnf: CellConfig): ServiceHandlerMap {
  const eventHandlers = {};

  // string will be treated as a path to folder containing event handler.
  if (typeof cellMeta.listen === 'string') {
    scanForServiceHandler(cellMeta.listen, cellCnf, eventHandlers);
    return new Map(Object.entries(eventHandlers));
  }

  if (Array.isArray(cellMeta.listen)) {
    registServiceHandlerFromModules(cellMeta.listen, cellCnf, eventHandlers);
    return new Map(Object.entries(eventHandlers));
  }

  return new Map(Object.entries(cellMeta.listen));
}

async function createDriverContainer(driverMeta: CellMeta): Promise<Container> {
  let providers = driverMeta.providers
    .filter(provider => !Array.isArray(provider) && typeof provider !== 'string') as GenericProvider[];

  driverMeta.providers.forEach(provider => {
    if (typeof provider === 'string') {
      providers = providers.concat(scanDirForProviders(provider));
      return;
    }

    if (Array.isArray(provider)) {
      providers = providers.concat(scanModulesForProviders(provider))
    }
  })

  const container = new Container();
  await container.addProviders(providers);
  await container.addModules(driverMeta.imports);

  return container;
}
