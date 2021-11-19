import { Container } from '../'
import { CycleTypeMap } from '../consts/cycle.const';
import { DiResolvers } from '../consts/di-resolver.const';
import { ClassType, CycleType, Token, FuncType, ValueType } from './';

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
  useModule: ClassType;
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
  deps?: any[];
}

export interface UseValueProvider<T> extends BaseProvider {
  /**
   * Use a value as dependency value
   */
  useValue: ValueType<T>;
}

export type GenericProvider<T = any> =
  UseModuleProvider | UseClassProvider<T> |
  ClassType<T> | UseFuncProvider<T> | UseValueProvider<T>;

/**
 * @package
 */
export interface ClassifiedProvider<T = any> extends BaseProvider {
  resolver: DiResolvers;
  useModule?: ClassType;
  useClass?: ClassType<T>;
  useFunc?: FuncType<T>;
  useValue?: ValueType<T>;
  deps?: ClassifiedUseFuncDep[];
  cycle?: CycleTypeMap;
}

export interface ClassifiedUseFuncDep {
  value: any;
  shouldResolve: boolean;
}

export interface ResolveOptions {
  // This stuff may be hidden from client later(alpha).
  extModule?: Container;

  /**
   * Global container.
   * 
   * When there is no provider matching with the given token,
   * it will find provider from this global container.
   * 
   * _Note:_ global container has lower priority than normal container.
   */
  global?: Container;
}
