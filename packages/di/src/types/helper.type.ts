export type ClassType<T> = { new(...args: any[]): T };

export type FuncType<T> = (...args: any[]) => T;

export type ValueType<T> = T;

export type Token = any;

export type CycleType = "permanent" | "transient";