import { Errors, CellConfig } from '../internal';
import { getServiceMeta, scanJs } from './';

export function scanForServiceHandler(basePath: string, cellCnf: CellConfig, eventHandlers): void {
  scanJs(basePath, (exports) => {
    Object.keys(exports).map(propKey => handleExportProp(
      exports, propKey, cellCnf, eventHandlers,
    ));
  });
}
/**
 * This function is useful when building source code with tsc
 */
// export function scanForServiceHandler(basePath: string, cellCnf: CellConfig, eventHandlers): void {
//   scanJs(
//     basePath,
//     (exports) => assignServiceHandler(exports, cellCnf, eventHandlers),
//   );
// }

export function registServiceHandlerFromModules(modules: any[], cellCnf: CellConfig, eventHandlers): void {
  modules.forEach(exports =>
    assignServiceHandler(exports, cellCnf, eventHandlers)
  );
}

function assignServiceHandler(exports, cellCnf: CellConfig, eventHandlers): void {
  Object.keys(exports).map(propKey => handleExportProp(
    exports, propKey, cellCnf, eventHandlers,
  ));
}

function handleExportProp(moduleExports, propKey, cellCnf: CellConfig, eventHandlers): void {
  const exportProp = moduleExports[propKey];

  if (typeof exportProp !== 'function') {
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