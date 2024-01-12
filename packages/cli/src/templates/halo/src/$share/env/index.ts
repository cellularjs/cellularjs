import { env as CllEnv } from '@cellularjs/env';

export class Env { }
export interface Env {
  NODE_PORT: number;
}

export const env = CllEnv<Env>;
