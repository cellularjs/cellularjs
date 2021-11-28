import { CellConfig, NetworkConfig } from '../../../src';
import { AuthCell } from '../cells/auth';
import { DummyCell } from '../cells/dummy'
import { IMSCell } from '../app/ims'
import { AuthHttpDriver } from '../remote-drivers/auth/http';
import { GoogleAuth } from '../remote-drivers/gg-auth';
import { UserCell } from '../cells/user';
import { WebpackCell } from '../cells/webpack';

export const authCellCnf: CellConfig = {
  name: 'Auth',
  space: 'neverland',
  driver: {
    local: AuthCell,
    http: AuthHttpDriver,
  },
};

export const dummyCellCnf: CellConfig = {
  name: 'Dummy',
  space: 'neverland',
  driver: DummyCell,
};

export const googleAuthCnf: CellConfig = {
  name: 'GoogleAuth',
  space: '?',
  driver: {
    XProtocol: GoogleAuth,
  },
};

export const imsCellCnf: CellConfig = {
  name: 'IMS',
  space: 'neverwood',
  driver: IMSCell,
};

export const userCellCnf: CellConfig = {
  name: 'User',
  space: 'neverland',
  driver: UserCell,
};

export const webpackCellCnf: CellConfig = {
  name: 'Webpack',
  space: 'neverland',
  driver: WebpackCell,
};

export const imsNetwork: NetworkConfig = [
  authCellCnf,
  googleAuthCnf,
  imsCellCnf,
  userCellCnf,
];