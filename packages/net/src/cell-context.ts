/**
 * Cell context hold information of current cell.
 * 
 * **Notice:** *Because `cellName` value is only binded after creating object,
 * so it is not available in `constructor`.*
 */
export class CellContext {
  /**
   * Cell name or cell type, it must be unique.
   */
  readonly cellName: string;
}