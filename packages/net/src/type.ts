import { GenericProvider, ImportableCnf, Container } from '@cellularjs/di';
import { CellContext } from './';

type ClassType<T> = { new (...args: any[]): T };

export enum ServiceScopeMap {
  publish = 1,
  space = 2,
  private = 4,
}

export type ServiceScope = keyof typeof ServiceScopeMap;

/**
 * Service handler meta data.
 */
export interface ServiceMeta {
  /**
   * Scope define accessibility for service handler. It make service handler look
   * like a method in a class with access modifier.
   *
   * - "publish": accessible from anywhere.
   * - "space": limit access only to cells having same space.
   * - "private": limit access to owner cell only.
   *
   * *By default, the scope value is "space".*
   */
  scope?: ServiceScope;
}

export interface AjustedServiceMeta {
  scope: ServiceScopeMap;
}

export type CellProviderConfig = GenericProvider | string;

export interface CellMeta {
  /**
   * It define set of providers for current cell.
   */
  providers?: CellProviderConfig[];

  /**
   * Compatible with @cellularjs/di, it define set of modules that will be imported
   * into current cell.
   */
  imports?: ImportableCnf[];

  // exports?: []; Nope. You can consider cell as a root container so it does not
  // have any exports at all.

  /**
   * If argument is a string, it will be treated as a path to a folder. It
   * will scan that folder(include sub folder) to get service handler automatically.
   * Service name in this case will be same as class name.<br/>
   * *Example: `"./services"`*<br/>
   *
   * You can also define key-pair of service name and service handler class.<br/>
   * *Example:*<br/>
   * ```
   * {
   *   SignUp, // short type, class name is service name.
   *   "any string": SignIn, // explicit type.
   * }
   * ```
   *
   * _CellularJS support many type but it is better to use a consistent type._
   */
  listen: string | { [serviceName: string]: ClassType<ServiceHandler> };
}

/**
 * @see https://cellularjs.com/docs/foundation/net/internal-message#211-to
 */
export type ToTargetHeader = `${string}:${string}`;

export type IrqHeader = {
  to?: ToTargetHeader;

  /**
   * The name of "cell:service" that this request come from.
   */
  referer?: ToTargetHeader;

  [key: string]: any;
};

export type IrsHeader = {
  status?: number;
  [key: string]: any;
};

/**
 * Cell service handler.
 */
export interface ServiceHandler {
  handle(): any | Promise<any>;
}

/**
 * Cell config contain cell infomation. You can get a cell config by invoking
 * `getResolvedCell('cell name')`.
 */
export interface CellConfig {
  /**
   * Cell name or cell type, it must be unique. Cell name are able to be used for
   * to routing request.
   *
   * **TIP**: *For better performance when comparing 2 cell name, let use `cellId`
   * (call `getResolvedCell(cellName)` to get `cellId`).*
   */
  name: string;

  /**
   * Space is used to specify the relationship of cells. If two cells have same
   * space, they are considered as in the same location and vice versa.
   *
   * **TIP**: *For better performance when comparing 2 space, let use `spaceId`
   * (call `getResolvedCell(cellName)` to get `spaceId`).*
   */
  space?: string;

  /**
   * Instead of choosing communication technique for you, @cellularjs/net let you
   * do it by yourself. With this kind of strategy, your ability is not limit by
   * @cellularjs/net.
   *
   * You can define many type of drivers with key-pair object. If you pass a class,
   * it will be treated as local driver.
   *
   * Example:
   * ```
   * AuthLocal
   * // or
   * {
   *   local: AuthLocal,
   *   http: AuthHttp",
   *   any: AuthAny",
   * }
   * ```
   */
  driver:
    | {
        local?: { new () };
        [driverName: string]: { new () };
      }
    | { new () };

  /**
   * In additional to reserved property defined by @cellularjs/net, you can add
   * more custom data with this property.
   *
   * You can get your customData by calling `getResolvedCell(cellNamme)`.
   */
  customData?: { [key: string]: any };
}

/**
 * If you have a cell, you have a network. If you have many cells, you have a big network.
 */
export type NetworkConfig = Array<CellConfig>;

export type ServiceHandlerMap = Map<string, ClassType<ServiceHandler>>;

export interface ResolvedDriver {
  container: Container;
  listener: ServiceHandlerMap;
}

export interface ResolvedCell {
  /**
   * `cellId` is short version of `CellConfig.name`. It is usefull for task
   * like cell comparation.
   */
  cellId: number;

  /**
   * `spaceId` is short version of `CellConfig.space`. It is usefull for task
   * like space comparation.
   */
  spaceId: number;

  cellConfig: CellConfig;

  drivers: Map<string, ResolvedDriver>;

  cellContext: CellContext;
}

export type ServiceHandlerClass = { new (...args: any[]): ServiceHandler };
