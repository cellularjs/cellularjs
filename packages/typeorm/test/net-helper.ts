import { getResolvedCell, LOCAL_DRIVER, ServiceHandler } from '@cellularjs/net';

export class NetHelper {
  static async addServiceHandler(
    cellName: string,
    Service: { new (...args: any): ServiceHandler },
    driver = LOCAL_DRIVER,
  ) {
    const resolvedCell = getResolvedCell(cellName);
    const resolvedDriver = resolvedCell.drivers.get(driver);
    await resolvedDriver.container.addProvider(Service);
    resolvedDriver.listener.set(Service.name, Service);
  }
}
