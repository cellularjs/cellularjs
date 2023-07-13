import { Tracer } from '../tracer';
import { Container } from '../';
import { DiCycle } from '../consts/cycle.const';
import { ClassType, CycleType, Token, FuncType, ValueType } from './';

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
// | Provider;

/**
 * @package
 */
export interface ClassifiedProvider<T = any> extends ProviderHasToken {
  useModule?: ClassType;
  useClass?: ClassType<T>;
  useFunc?: FuncType<T>;
  useValue?: ValueType<T>;
  useExisting?: Token;
  deps?: ClassifiedUseFuncDep[];
  cycle?: DiCycle;
}

export interface ClassifiedUseFuncDep {
  value: any;
  shouldResolve: boolean;
}

/**
 * _DO NOT TRY TO IMPORT THIS KEY, IT IS **NOT** PUBLIC FOR EXTERNAL USE._
 * @since 0.15.2
 */
export const _TRACER_KEY = Symbol('tracer');

export interface ResolveOptions {
  /**
   * `extModule` is a container object that is a "child" of this container.
   *
   * _Note:_ `extModule` has higher priority than parent module,
   * so it can override parent module providers.
   * ```
   * extModule > normal module > global module
   * ```
   * @since 0.1.0
   */
  extModule?: Container;

  /**
   * @since 0.11.0
   */
  parentModule?: Container;

  /**
   * For now, `Tracer` is not public(via index) and API may be changed.
   *
   * _**(Please don't try to import and use it.)**_
   *
   * @since 0.11.0
   */
  [_TRACER_KEY]?: Tracer;
}
