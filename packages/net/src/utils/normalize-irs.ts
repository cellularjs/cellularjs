import { IRS } from '../';

export function normalizeIrs(result: any) {
  return result instanceof IRS ? result : new IRS({ status: 200 }, result);
}
