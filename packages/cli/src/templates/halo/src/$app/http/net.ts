import { NetworkConfig, createNetWork } from '@cellularjs/net';
import { User } from 'user';

export async function initNetwork() {
  const netCnfs: NetworkConfig = [
    { name: User.name, driver: User },
  ];

  await createNetWork(netCnfs);
}