import { Tracer } from '../tracer';
import { Container } from '../';
import { CycleTypeMap } from '../consts/cycle.const';
import { DiResolvers } from '../consts/di-resolver.const';
import {
  ClassType,
  CycleType,
  Token,
  FuncType,
  ValueType,
  ResolveTrace,
} from './';

export interface ProviderHasCycle {
  /**
   * Resolved value lifecycle. By default, resolved value will be treated as "transient" cycle.
   * - "permanent": resolved value will be cached.
   * - "transient": resolved value will not be cached.
   */
  cycle?: CycleType;
}

export interface ProviderHasToken {
  /**
   * Unique identifier for a provider inside container.
   */
  token: Token;
}

export interface UseModuleProvider extends ProviderHasToken {
  /**
   * Use a module as reference to resolve dependency value without import that module into current container.
   */
  useModule: ClassType;
}

export interface UseClassProvider<T>
  extends ProviderHasToken,
    ProviderHasCycle {
  /**
   * Use a class to resolve dependency value.
   */
  useClass: ClassType<T>;
}

export interface UseFuncProvider<T> extends ProviderHasToken, ProviderHasCycle {
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

export interface UseValueProvider<T> extends ProviderHasToken {
  /**
   * Use a value as dependency value
   */
  useValue: ValueType<T>;
}

export interface UseExistingProvider extends ProviderHasToken {
  /**
   * Token of exist provider.
   */
  useExisting: Token;
}

export type GenericProvider<T = any> =
  | UseModuleProvider
  | UseClassProvider<T>
  | ClassType<T>
  | UseFuncProvider<T>
  | UseValueProvider<T>
  | UseExistingProvider;

/**
 * @package
 */
export interface ClassifiedProvider<T = any> extends ProviderHasToken {
  resolver: DiResolvers;
  useModule?: ClassType;
  useClass?: ClassType<T>;
  useFunc?: FuncType<T>;
  useValue?: ValueType<T>;
  useExisting?: Token;
  deps?: ClassifiedUseFuncDep[];
  cycle?: CycleTypeMap;
}

export interface ClassifiedUseFuncDep {
  value: any;
  shouldResolve: boolean;
}

export interface ResolveOptions {
  /**
   * `extModule` is a container object that is a "child" of this container.
   *
   * _Note:_ `extModule` has higher priority than parent module,
   * so it can override parent module providers.
   * ```
   * extModule > nornal container > global
   * ```
   */
  extModule?: Container;

  /**
   * Global container.
   *
   * If there is no provider matching with the given token,
   * it will find provider from this global container.
   *
   * _Note:_ global container has lower priority than normal container.
   * ```
   * extModule > nornal container > global
   * ```
   *
   * @deprecated For internal use only.
   */
  global?: Container;
}

export interface InnerResolveOptions extends ResolveOptions {
  tracer?: Tracer<ResolveTrace>;
}
