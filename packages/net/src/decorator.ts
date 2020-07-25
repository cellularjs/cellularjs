import { CellOptions } from "./type";
import { CLL_CELL_OPTS } from "./key";

export const Cell = (options: CellOptions) => (target) => {
  Reflect.defineMetadata(CLL_CELL_OPTS, options, target);
  return target;
}

export const Event = () => (target) => {
  if (!target.prototype || !target.prototype.handle) {
    throw new Error(`'${target.name}' must implements EventHandler`);
  }

  return target;
}