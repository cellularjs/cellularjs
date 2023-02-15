import { GenericProvider, ImportableCnf, Container } from '@cellularjs/di';
import { CellContext } from './';

type ClassType<T> = { new (...args: any[]): T };

/**
 * @since 0.1.0
 */
export enum ServiceScopeMap {
  publish = 1,
  space = 2,
  private = 4,
}

/**
 * @since 0.1.0
 * @see https://cellularjs.com/docs/foundation/net/service#21-scope
 */
export type ServiceScope = keyof typeof ServiceScopeMap;

/**
 * Service handler meta data.
 *
 * @since 0.1.0
 * @see https://cellularjs.com/docs/foundation/net/service#2-service-decorator
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
   *
   * @since 0.1.0
   * @see https://cellularjs.com/docs/foundation/net/service#21-scope
   */
  scope?: ServiceScope;
}

export interface AjustedServiceMeta {
  scope: ServiceScopeMap;
}

/**
 * @since 0.1.0
 * @see https://cellularjs.com/docs/foundation/net/cell#21-providers
 */
export type CellProviderConfig = GenericProvider | string;

/**
 * @see https://cellularjs.com/docs/foundation/net/cell#2-cell-decorator
 * @since 0.1.0
 */
export interface CellMeta {
  /**
   * It define set of providers for current cell.
   *
   * @see https://cellularjs.com/docs/foundation/net/cell#21-providers
   * @since 0.1.0
   */
  providers?: CellProviderConfig[];

  /**
   * Compatible with @cellularjs/di, it define set of modules that will be imported
   * into current cell.
   *
   * @see https://cellularjs.com/docs/foundation/net/cell#22-imports
   * @since 0.1.0
   */
  imports?: ImportableCnf[];

  // exports?: []; Nope. You can consider cell as a root container so it does not
  // have any exports at all.

  /**
   * If argument is a string(need @cellularjs/cli), it will be treated as a path to a folder. It
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
   *
   * @see https://cellularjs.com/docs/foundation/net/cell#23-listen
   * @since 0.1.0
   */
  listen: string | { [serviceName: string]: ClassType<ServiceHandler> };
}

/**
 * @since 0.13.4
 */
type NormalizedProvider =
  | CellProviderConfig
  | [__WebpackModuleApi.RequireContext];

/**
 * @since 0.13.4
 */
export type NormalizedCellMeta = {
  providers: NormalizedProvider[];
  imports: ImportableCnf[];
  listen:
    | string
    | { [serviceName: string]: ClassType<ServiceHandler> }
    | [__WebpackModuleApi.RequireContext];
};

/**
 * @see https://cellularjs.com/docs/foundation/net/internal-message#211-to
 * @since 0.3.0
 */
export type ToTargetHeader = `${string}:${string}`;

/**
 * @see https://cellularjs.com/docs/foundation/net/internal-message#21-request-header
 * @since 0.1.0
 */
export type IrqHeader = {
  /**
   * @see https://cellularjs.com/docs/foundation/net/internal-message#211-to
   * @since 0.1.0
   */
  to?: ToTargetHeader;

  /**
   * The name of "cell:service" that this request come from.
   *
   * @see https://cellularjs.com/docs/foundation/net/internal-message#212-referer
   * @since 0.1.0
   */
  referer?: ToTargetHeader;

  [key: string]: any;
};

export type IrsHeader = {
  /**
   * IRS status is similar to HTTP status code.
   *
   * @see https://cellularjs.com/docs/foundation/net/internal-message#311-status
   * @since 0.1.0
   */
  status?: number;
  [key: string]: any;
};

/**
 * Cell service handler.
 *
 * @see https://cellularjs.com/docs/foundation/net/service#3-service-handler
 * @since 0.1.0
 */
export interface ServiceHandler {
  handle(): any | Promise<any>;
}

/**
 * Cell config contain cell infomation. You can get a cell config by invoking
 * `getResolvedCell('cell name')`.
 *
 * @see https://cellularjs.com/docs/foundation/net/virtual-network/#1-network-configuration
 * @since 0.1.0
 */
export interface CellConfig {
  /**
   * Cell name or cell type, it must be unique. Cell name are able to be used for
   * to routing request.
   *
   * **TIP**: *For better performance when comparing 2 cell name, let use `cellId`
   * (call `getResolvedCell(cellName)` to get `cellId`).*
   *
   * @see https://cellularjs.com/docs/foundation/net/virtual-network#11-name
   * @since 0.1.0
   */
  name: string;

  /**
   * Space is used to specify the relationship of cells. If two cells have same
   * space, they are considered as in the same location and vice versa.
   *
   * **TIP**: *For better performance when comparing 2 space, let use `spaceId`
   * (call `getResolvedCell(cellName)` to get `spaceId`).*
   *
   * @see https://cellularjs.com/docs/foundation/net/virtual-network#12-space
   * @since 0.1.0
   */
  space?: string;

  /**
   * Instead of choosing communication technique for you, @cellularjs/net let you
   * do it by yourself. With this kind of strategy, your ability is not limit by
   * @cellularjs/net.
   *
   * You can define any type of drivers with key-pair object. If you pass a class,
   * it will be treated as local driver.
   *
   * Example:
   * ```
   * AuthLocal
   * // or
   * {
   *   local: AuthLocal,
   *   http: AuthHttp,
   *   anyKey: AuthAny,
   * }
   * ```
   *
   * @see https://cellularjs.com/docs/foundation/net/virtual-network#13-driver
   * @since 0.1.0
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
   *
   * @since 0.1.0
   */
  customData?: { [key: string]: any };
}

/**
 * If you have a cell, you have a network. If you have many cells, you have a big network.
 *
 * @see https://cellularjs.com/docs/foundation/net/virtual-network#11-name
 * @since 0.1.0
 */
export type NetworkConfig = Array<CellConfig>;

export type ServiceHandlerMap = Map<string, ClassType<ServiceHandler>>;

/**
 * @since 0.1.0
 */
export interface ResolvedDriver {
  /**
   * @since 0.1.0
   */
  container: Container;

  /**
   * @since 0.1.0
   */
  listener: ServiceHandlerMap;
}

/**
 * @since 0.1.0
 */
export interface ResolvedCell {
  /**
   * `cellId` is short version of `CellConfig.name`. It is usefull for task
   * like cell comparation.
   *
   * @since 0.1.0
   */
  cellId: number;

  /**
   * `spaceId` is short version of `CellConfig.space`. It is usefull for task
   * like space comparation.
   *
   * @see https://cellularjs.com/docs/foundation/net/transporter#2-using-specific-driver
   * @since 0.1.0
   */
  spaceId: number;

  /**
   * @see https://cellularjs.com/docs/foundation/net/virtual-network/#1-network-configuration
   * @since 0.1.0
   */
  cellConfig: CellConfig;

  /**
   * Technically, a class that is decorated by `@Cell` decorator is just a driver.
   *
   * @see https://cellularjs.com/docs/foundation/net/virtual-network#13-driver
   * @since 0.1.0
   */
  drivers: Map<string, ResolvedDriver>;

  /**
   * @deprecated CellContext is useless, it will be removed in the near future.
   * @since 0.1.0
   */
  cellContext: CellContext;
}

/**
 * @since 0.1.0
 */
export type ServiceHandlerClass = { new (...args: any[]): ServiceHandler };
