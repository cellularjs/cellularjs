import { Injectable } from '@cellularjs/di';

@Injectable()
export class UserRepo { }

export function getUserAgent() {
  return 'web';
}

export const DUMMY = 'dummy';