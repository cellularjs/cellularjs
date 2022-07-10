export type ClassType<T = any> = { new (...args: any[]): T };

export type FuncType<T> = (...args: any[]) => T;

export type ValueType<T> = T;

export type Token = any;

export type CycleType = 'permanent' | 'transient';

export interface ResolveTrace {
  module: ClassType;
  token: Token;
}
