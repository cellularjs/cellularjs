import { CellConfig, NetworkConfig } from "../../../src";

const cellConfigs: {[key: string]: CellConfig} = {
  Auth: {
    name: "Auth",
    space: "neverland",
    driver: {
      local: __dirname + "/../cells/auth#AuthCell",
      http: __dirname + "/../remote-drivers/auth#AuthCell",
    },
  },
  User: {
    name: "User",
    space: "neverland",
    driver: __dirname + "/../cells/user#UserCell",
  },
  IMS: {
    name: "IMS",
    space: "neverwood",
    driver: __dirname + "/../app/sso-form#UserCell",
  },
  GoogleAuth: {
    name: "GoogleAuth",
    space: '?',
    driver: __dirname + "/../remote-drivers/gg-auth#GgAuth",
  },
}

export const imsNetwork: NetworkConfig = [
  cellConfigs.Auth,
];