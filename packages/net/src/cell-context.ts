import { Container } from "@cellularjs/di";

/**
 * Cell context hold information of current cell.
 */
export class CellContext {
  /**
   * `cellName` will be auto binded when initializing network.  
   * **This is reserved property, DO NOT override it.**
   */
  readonly cellName: string;

  /**
   * `container` will be auto binded when initializing network.  
   * **This is reserved property, DO NOT override it.**
   */
  readonly container: Container;
}