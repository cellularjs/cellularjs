import { CLL_CELL_OPTS, CLL_SERVICE_OPTS } from '../'
import { CellMeta, AjustedServiceMeta } from '../internal';

export function getCellMeta(driverClass): CellMeta {
  return Reflect.getMetadata(CLL_CELL_OPTS, driverClass);
}

export function getServiceMeta(eventHandlerClass): AjustedServiceMeta {
  return Reflect.getMetadata(CLL_SERVICE_OPTS, eventHandlerClass);
}