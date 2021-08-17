import { Errors, CellConfig } from "../";
import { getServiceMeta, scanJs } from "./";

export function scanForServiceHandler(basePath: string, cellCnf: CellConfig, eventHandlers): void {
  scanJs(basePath, (exports) => {
    Object.keys(exports).map(propKey => handleExportProp(
      exports, propKey, cellCnf, eventHandlers
    ));
  });
}

function handleExportProp(moduleExports, propKey, cellCnf: CellConfig, eventHandlers): void {
  const exportProp = moduleExports[propKey];

  if (typeof exportProp !== "function") {
    return;
  }

  if (!getServiceMeta(exportProp)) {
    return;
  }

  if (eventHandlers[propKey]) {
    throw Errors.DuplicateServiceHandlerName(propKey, cellCnf.name);
  }

  eventHandlers[propKey] = exportProp;
}