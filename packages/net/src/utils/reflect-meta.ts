import { CellMeta, AjustedServiceMeta, CLL_SERVICE_OPTS, CLL_CELL_OPTS } from '../internal';

export function getCellMeta(driverClass): CellMeta {
  return Reflect.getMetadata(CLL_CELL_OPTS, driverClass);
}

export function getServiceMeta(serviceHandlerClass): AjustedServiceMeta {
  return Reflect.getMetadata(CLL_SERVICE_OPTS, serviceHandlerClass);
}