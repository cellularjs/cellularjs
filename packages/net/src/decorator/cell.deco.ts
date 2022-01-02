import * as path from 'path';
import { CellMeta } from '..';
import { CLL_CELL_OPTS } from '../internal';

/**
 * Config cell with meta data.
 */
export const Cell = (rawCellMeta: CellMeta) => (target) => {
  const cellDriverMeta: CellMeta = {
    ...rawCellMeta,
    providers: rawCellMeta.providers || [],
  };

  const stackArr = new Error().stack.split('\n');

  // hard code
  const callerStackStr = stackArr[4];

  const callerPathArr = callerStackStr
    .slice(callerStackStr.indexOf('(') + 1)
    .split(path.sep);

  callerPathArr.pop();

  const basePath = callerPathArr.join(path.sep);

  if (typeof cellDriverMeta.listen === 'string') {
    cellDriverMeta.listen = path.resolve(
      basePath,
      path.normalize(cellDriverMeta.listen),
    );
  }

  cellDriverMeta.providers = cellDriverMeta.providers.map((provider) => {
    if (typeof provider === 'string') {
      return path.resolve(basePath, provider);
    }

    return provider;
  });

  Reflect.defineMetadata(CLL_CELL_OPTS, cellDriverMeta, target);

  return target;
};
