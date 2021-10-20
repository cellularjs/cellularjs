import { CLL_CELL_OPTS, CLL_EVENT_OPTS, CellMeta, AjustedServiceMeta } from '..';

export function getCellMeta(driverClass): CellMeta {
  return Reflect.getMetadata(CLL_CELL_OPTS, driverClass);
}

export function getServiceMeta(eventHandlerClass): AjustedServiceMeta {
  return Reflect.getMetadata(CLL_EVENT_OPTS, eventHandlerClass);
}