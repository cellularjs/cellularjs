export type ClassType<T> = { new(...args: any[]): T };

export type FuncType<T> = (...args: any[]) => T;

export type ValueType<T> = T;

export type Token = any;

export type CycleType = "permanent" | "transient";

export const PermanentCycle = 1;
export const TransientCycle = 2;

export enum CycleTypeMap {
  permanent = PermanentCycle,
  transient = TransientCycle,
}

export interface ProviderHasCycle {
  /**
   * Resolved value lifecycle. By default, resolved value will be treated as "transient" cycle.
   * - "permanent": resolved value will be cached.
   * - "transient": resolved value will not be cached.
   */
  cycle?: CycleType;
}

export interface BaseProvider {
  /**
   * Unique identifier for a provider inside container.
   */
  token: Token;
}

export interface UseModuleProvider extends BaseProvider {
  /**
   * Use a module as reference to resolve dependency value without import that module into current container.
   */
  useModule: ClassType<any>;
}

export interface UseClassProvider<T> extends BaseProvider, ProviderHasCycle {
  /**
   * Use a class to resolve dependency value.
   */
  useClass: ClassType<T>;
}

export interface UseFuncProvider<T> extends BaseProvider, ProviderHasCycle {
  /**
   * Use a function as factory to assemble dependency value.
   */
  useFunc: FuncType<T>;

  /**
   * List dependencies required by useFunc.
   * 
   * ***Notice**:
   * - Dependencies order must be same as useFunc parameters order.
   * - Class will be use as token for provider, so you need to define its provider.
   */
  deps?: any[],
}

export interface UseValueProvider<T> extends BaseProvider {
  /**
   * Use a value as dependency value
   */
  useValue: ValueType<T>;
}

export type GenericProvider<T> = UseModuleProvider | UseClassProvider<T> | ClassType<T> | UseFuncProvider<T> | UseValueProvider<T>;

/**
 * @package
 */
export enum DiResolvers {
  useModuleResolver = 0,
  useClassResolver = 1,
  useFuncResolver = 2,
  useValueResolver = 3,
}

/**
 * @package
 */
export interface AdjustedProvider<T> extends BaseProvider {
  resolver: DiResolvers;
  useModule?: ClassType<any>,
  useClass?: ClassType<T>;
  useFunc?: FuncType<T>;
  useValue?: ValueType<T>;
  deps?: AdjustedDep[];
  cycle?: CycleTypeMap;
}

export interface AdjustedDep {
  value: any,
  isClass: boolean | undefined,
}

export type ImportableCnf = ClassType<any> | ExtModuleMeta;

export type ExportableCnf = ClassType<any> | ExtModuleMeta;

export interface ModuleMeta {
  providers?: GenericProvider<any>[];
  imports?: ImportableCnf[];
  exports?: ExportableCnf[];
}

export interface ExtModuleMeta extends ModuleMeta {
  /**
   * Module class that you want to extend
   */ 
  extModule: ClassType<any>;
}