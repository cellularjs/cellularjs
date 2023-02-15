import * as path from 'path';
import { CellMeta } from '..';
import { CLL_CELL_OPTS, NormalizedCellMeta } from '../internal';

/**
 * Config cell with meta data.
 *
 * @see https://cellularjs.com/docs/foundation/net/cell
 * @since 0.1.0
 */
export const Cell = (rawCellMeta: CellMeta) => (target) => {
  const cellDriverMeta: NormalizedCellMeta = {
    ...rawCellMeta,
    providers: rawCellMeta.providers || [],
    imports: rawCellMeta.imports || [],
  } as NormalizedCellMeta;

  const stackArr = new Error().stack?.split('\n') || [];

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
