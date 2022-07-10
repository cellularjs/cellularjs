import { Container, GenericProvider } from '@cellularjs/di';
import { LOCAL_DRIVER, CellConfig, CellMeta } from '..';
import { Errors } from '../internal';
import { ResolvedDriver, ServiceHandlerMap } from '../type';
import {
  getCellMeta,
  scanDirForServiceHandler,
  scanModulesForServiceHandler,
  scanDirForProviders,
  scanModulesForProviders,
} from '../utils';

export async function resolveDrivers(cellConfig: CellConfig) {
  const drivers = new Map<string, ResolvedDriver>();

  if (typeof cellConfig.driver !== 'object') {
    const driver = await resolveDriver(cellConfig, cellConfig.driver);

    return drivers.set(LOCAL_DRIVER, driver);
  }

  const resolveDriverTasks = Object.keys(cellConfig.driver).map(
    async (driver) => {
      const driverClass = cellConfig.driver[driver];

      drivers.set(driver, await resolveDriver(cellConfig, driverClass));
    },
  );

  await Promise.all(resolveDriverTasks);

  return drivers;
}

async function resolveDriver(
  cellCnf: CellConfig,
  driverClass,
): Promise<ResolvedDriver> {
  const cellMeta = getCellMeta(driverClass);
  if (!cellMeta) {
    throw Errors.InvalidDriverClass(cellCnf.name);
  }

  const listener = resolveListener(cellMeta, cellCnf);
  const driverContainer = await createDriverContainer(cellMeta, driverClass);

  await driverContainer.addProviders(Array.from(listener.values()));

  return {
    listener,
    container: driverContainer,
  };
}

function resolveListener(
  cellMeta: CellMeta,
  cellCnf: CellConfig,
): ServiceHandlerMap {
  const serviceHandlers = {};

  // string will be treated as a path to folder containing service handler.
  if (typeof cellMeta.listen === 'string') {
    scanDirForServiceHandler(cellMeta.listen, (serviceName, newService) => {
      if (serviceHandlers[serviceName]) {
        throw Errors.DuplicateServiceHandlerName(serviceName, cellCnf.name);
      }

      serviceHandlers[serviceName] = newService;
    });

    return new Map(Object.entries(serviceHandlers));
  }

  if (Array.isArray(cellMeta.listen)) {
    scanModulesForServiceHandler(cellMeta.listen, (serviceName, newService) => {
      if (serviceHandlers[serviceName]) {
        throw Errors.DuplicateServiceHandlerName(serviceName, cellCnf.name);
      }

      serviceHandlers[serviceName] = newService;
    });

    return new Map(Object.entries(serviceHandlers));
  }

  return new Map(Object.entries(cellMeta.listen));
}

async function createDriverContainer(
  cellMeta: CellMeta,
  driverClass,
): Promise<Container> {
  const driverContainer = new Container(driverClass);

  await driverContainer.addProviders(extractUsableProviders(cellMeta));
  await driverContainer.addModules(cellMeta.imports);

  return driverContainer;
}

function extractUsableProviders(cellMeta: CellMeta) {
  let usableProviders = <GenericProvider[]>(
    cellMeta.providers.filter(
      (provider) => typeof provider !== 'string' && !Array.isArray(provider),
    )
  );

  cellMeta.providers.forEach((provider) => {
    if (typeof provider === 'string') {
      usableProviders = usableProviders.concat(scanDirForProviders(provider));
      return;
    }

    if (Array.isArray(provider)) {
      usableProviders = usableProviders.concat(
        scanModulesForProviders(provider),
      );
    }
  });

  return usableProviders;
}
