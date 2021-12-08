import { addServiceProviders } from '../../../../src'
import { Session } from './key';
import { Connector } from './connector';

export const Transaction = () => service => {
  addServiceProviders(service, [
    {
      token: Session,
      useFunc: (connector: Connector) => connector.getSession(),
      deps: [Connector],
    },
  ]);

  return service;
}