import { Container } from '@cellularjs/di';
import { getResolvedCell, ServiceHandler, CellContext, IRQ } from '..';
import { Errors, ResolvedDriver, ServiceHandlerClass } from '../internal';
import { scopeContraints } from '../scope';
import { getServiceProviders, getServiceProxies } from '../service-helper';
import { getServiceMeta } from '../utils';
import { NextHandler } from './next-handler'

export async function resolveServiceHandler(
  irq: IRQ,
  refererCell: CellContext,
  driver: string,
): Promise<ServiceHandler> {
  const [destCellName, serviceName] = irq.header.to.split(':');
  const destResolvedCell = getResolvedCell(destCellName);

  if (!destResolvedCell) {
    throw Errors.NoResolvedCell(destCellName, driver);
  }

  const resolvedDriver = destResolvedCell.drivers.get(driver);
  if (!resolvedDriver) {
    throw Errors.NoResolvedDriver(driver, irq.header.to);
  }

  const DestServiceHandler = resolvedDriver.listener.get(serviceName);
  if (!DestServiceHandler) {
    throw Errors.NoServiceHandler(driver, irq.header.to);
  }

  const serviceMeta = getServiceMeta(DestServiceHandler);

  // DO: check service scope constraint
  scopeContraints[serviceMeta.scope](destResolvedCell, refererCell);

  const extModule = new Container();
  await extModule.addProviders([
    ...getServiceProviders(DestServiceHandler),
    { token: IRQ, useValue: irq },
    { token: CellContext, useValue: destResolvedCell.cellContext },
  ]);

  return getServiceHandler(DestServiceHandler, resolvedDriver, extModule);
}

async function getServiceHandler(
  ServiceHandlerClass: ServiceHandlerClass,
  resolvedDriver: ResolvedDriver,
  extModule: Container,
): Promise<ServiceHandler> {
  const proxyClasses = getServiceProxies(ServiceHandlerClass);

  if (proxyClasses.length === 0) {
    return await resolvedDriver.container.resolve(
      ServiceHandlerClass, { extModule },
    );
  }

  return getServiceHandlerWithProxy(
    ServiceHandlerClass,
    resolvedDriver,
    extModule,
    proxyClasses,
  );
}

async function getServiceHandlerWithProxy(
  ServiceHandlerClass: ServiceHandlerClass,
  resolvedDriver: ResolvedDriver,
  extModule: Container,
  proxyClasses: ServiceHandlerClass[],
): Promise<ServiceHandler> {
  const nextHandler = new NextHandler(
    ServiceHandlerClass,
    proxyClasses,
    extModule,
    resolvedDriver,
  );

  await extModule.addProvider({
    token: NextHandler,
    useValue: nextHandler,
  });

  const serviceHandler: ServiceHandler = {
    handle: () => nextHandler.handle(),
  };

  return serviceHandler;
}
