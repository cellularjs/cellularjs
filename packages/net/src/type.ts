import { GenericProvider, ImportableCnf, ClassType } from "@cellularjs/di";
import { CellContext } from "./";
import { CellularIRS } from "./msg";

export type CellOptions = {
  providers?: GenericProvider<any>[];
  imports?: ImportableCnf[];
  context?: ClassType<CellContext>;
  listen: { [eventName: string]: ClassType<EventHandler> };
};

export interface EventHandler {
  handle: () => Promise<CellularIRS>;
}

export type CellConfig = {
  /**
   * Cell name(or cell type, it must be unique).
   */
  name: string;

  /**
   * Space is used to identify the relative of location among cells.
   * If a cluster of cells have same space, they are considered as same in location and vice versa.
   */
  space: any;

  driver:
  /**
   * If driver is a string then it will be treated as local driver
   */
  string |

  { local?: string, [key: string]: string };

  /**
   * In additional to reserved keys defined by @cellularjs/net, you can add more custom meta data by yourself.
   */
  [customKey: string]: any,
}

/**
 * If you have a node, you have a network. If you have many nodes, you have a big network.
 */
export type NetworkConfig = CellConfig[];

export type ResolvedDriver = {
  listen: { [eventName: string]: ClassType<EventHandler> },
  context: CellContext,
};

export type ResolvedCell = {
  cellConfig: CellConfig;
  resolvedDriver: {
    local: ResolvedDriver,
    [key: string]: ResolvedDriver,
  };
};
