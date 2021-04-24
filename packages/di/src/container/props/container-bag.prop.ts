import { Token, AdjustedProvider, ClassType, Container } from '../../'

export class ContainerBag {
  /**
   * A store for cached resolved values.
   */
  protected _resolvedValues = new Map<Token, any>();

  /**
   * List of providers containing information for how to create dependency value.
   */
  protected _providers = new Map<Token, AdjustedProvider<any>>();

  /**
   * List of modules that current module/container use as reference for resolving
   * dependency value.
   */
  protected _extModules = new Map<ClassType<any>, Container>();

  /**
   * _refModule is a module that _extModule extend from. It help "extend" become real.
   */
  protected _refModule: Container;

  /**
   * _extModule hold "extend stuffs"(Eg: providers).
   * 
   * **Notice**: *this temporay property will be deleted right after resolving value.*
   */
  protected _extModule: Container;
}