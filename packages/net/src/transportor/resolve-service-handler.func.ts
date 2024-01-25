import { getResolvedCell, IRQ } from '..';
import { Errors, ServiceHandlerNormalized } from '../internal';
import { scopeContraints } from '../scope';
import { ServiceFactory } from '../service-helper';
import { getServiceMeta } from '../utils';

export async function resolveServiceHandler(
  irq: IRQ,
  driver: string,
): Promise<ServiceHandlerNormalized> {
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
  scopeContraints[serviceMeta.scope](destResolvedCell, irq.header.referer);

  return await ServiceFactory.resolve(DestServiceHandler, {
    includeServiceProvider: true,
    includeServiceProxy: true,
    rootContainer: resolvedDriver.container,
    providers: [{ token: IRQ, useValue: irq }],
  });
}
