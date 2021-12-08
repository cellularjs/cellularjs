import { Container } from '@cellularjs/di';
import { getResolvedCell, ServiceHandler, CellContext, IRQ } from '..';
import { Errors } from '../internal';
import { scopeContraints } from '../scope';
import { getServiceProviders, getServiceProxies } from '../service-helper';
import { getServiceMeta } from '../utils';
import { ResolvedDriver } from 'type';

export async function resolveServiceHandler(
  irq: IRQ,
  refererCell: CellContext,
  driver: string,
): Promise<ServiceHandler> {
  const [destCellName, eventName] = irq.header.to.split(':');
  const destResolvedCell = getResolvedCell(destCellName);

  if (!destResolvedCell) {
    throw Errors.NoResolvedCell(destCellName, driver);
  }

  const resolvedDriver = destResolvedCell.drivers.get(driver);
  if (!resolvedDriver) {
    throw Errors.NoResolvedDriver(driver, irq.header.to);
  }

  const DestServiceHandler = resolvedDriver.listener.get(eventName);
  if (!DestServiceHandler) {
    throw Errors.NoServiceHandler(driver, irq.header.to);
  }

  const serviceMeta = getServiceMeta(DestServiceHandler);

  // DO: check event scope constraint
  scopeContraints[serviceMeta.scope](destResolvedCell, refererCell);

  const extModule = new Container();
  extModule.addProviders([
    ...getServiceProviders(DestServiceHandler),
    { token: IRQ, useValue: irq },
    { token: CellContext, useValue: destResolvedCell.cellContext },
  ])
  const eventHandler = await resolvedDriver.container.resolve<ServiceHandler>(
    DestServiceHandler, { extModule },
  );

  const proxyClasses = getServiceProxies(DestServiceHandler);
  if (!proxyClasses.length) {
    return eventHandler;
  }

  return resolveProxyInstance(resolvedDriver, extModule, proxyClasses, eventHandler);
}

async function resolveProxyInstance(
  resolvedDriver: ResolvedDriver,
  extModule: Container,
  proxyClasses: { new(...args: any[]): ServiceHandler }[],
  eventHandler: ServiceHandler,
) {
  let proxyInstance: ServiceHandler;

  for (let i = 0; i < proxyClasses.length; i++) {
    extModule.remove(ServiceHandler)
    const proxyClass = proxyClasses[i];

    extModule.addProviders([
      { token: ServiceHandler, useValue: proxyInstance || eventHandler },
      { token: proxyClass, useClass: proxyClass },
    ]);

    proxyInstance = await resolvedDriver.container.resolve(proxyClass, { extModule });
  }

  return proxyInstance;
}