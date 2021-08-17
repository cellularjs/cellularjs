import { Container, GenericProvider } from "@cellularjs/di";
import { ControlPlane } from ".";
import { CellContext, CLL_CELL_CTX, Errors } from "..";
import { CellConfig, ResolvedDriver, CellMeta, ServiceHandlerMap } from "../type";
import { freezeProperty, getCellMeta, scanForServiceHandler, scanForProviders } from "../utils";

export async function resolveDrivers(cellConfig: CellConfig) {
  const drivers = new Map<string, ResolvedDriver>();

  if (typeof cellConfig.driver !== 'object') {
    const driver = await resolveDriver(cellConfig, cellConfig.driver);

    return drivers.set(ControlPlane.DEFAULT_DRIVER, driver);
  }

  const resolveDriverTasks = Object.keys(cellConfig.driver).map(async driverType => {
    const driverClass = cellConfig.driver[driverType];
    const driver = await resolveDriver(cellConfig, driverClass);

    drivers.set(driverType, driver);
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
  const container = await createContainer(driverMeta, cellCnf);

  container.addProviders(Array.from(listener.values()));

  return {
    listener,
    container,
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

async function createContainer(cellMeta: CellMeta, cellConfig: CellConfig): Promise<Container> {
  let providers = cellMeta.providers
    .filter(provider => typeof provider !== 'string') as GenericProvider<any>[];

  cellMeta.providers.forEach(provider => {
    if (typeof provider !== 'string') {
      return;
    }

    providers = providers.concat(scanForProviders(provider));
  })

  const container = new Container();
  container.addProviders(providers);
  container.addModules(cellMeta.imports);
  container.addProvider({
    token: CLL_CELL_CTX,
    useValue: await resolveCellCtx(cellMeta, container, cellConfig),
  });

  return container;
}

async function resolveCellCtx(
  cellMeta: CellMeta,
  container: Container,
  cellConfig: CellConfig,
): Promise<CellContext> {
  const ctxClass = cellMeta.context || CellContext;
  const extModule = new Container();
  extModule.addProvider(ctxClass);
  const cellCtx: CellContext = await container.resolve(ctxClass, {
    extModule
  });

  freezeProperty(cellCtx, "cellName", cellConfig.name);

  return cellCtx;
}