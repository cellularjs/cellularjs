import { Container } from '@cellularjs/di';
import { getResolvedCell, ServiceHandler, CellContext, IRQ } from '..';
import { Errors } from '../internal';
import { scopeContraints } from '../scope';
import { getServiceMeta } from '../utils';

export async function resolveServiceHandler(
  irq: IRQ,
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
  scopeContraints[serviceMeta.scope](destResolvedCell, irq.header.referer);

  const extModule = new Container();
  await extModule.addProviders([
    { token: IRQ, useValue: irq },
    { token: CellContext, useValue: destResolvedCell.cellContext },
  ]);

  return await resolvedDriver.container.resolve(DestServiceHandler, {
    extModule,
  });
}
