import { NetErrorCode, NetError } from '..';

export const Errors = {
  DuplicateCellName: (cellName) =>
    new NetError(
      `Cell name '${cellName}' is duplicated`,
      NetErrorCode.DuplicateCellName,
    ),

  InvalidDriverClass: (entry) =>
    new NetError(
      `Driver must be a class, '${entry}' does not point to class`,
      NetErrorCode.InvalidDriverClass,
    ),

  DuplicateServiceHandlerName: (serviceName, cellName) =>
    new NetError(
      `Service handler name for '${serviceName}' is duplicated in '${cellName}' cell`,
      NetErrorCode.DuplicateServiceHandlerName,
    ),

  NoResolvedCell: (targetCellName, driver) =>
    new NetError(
      `There is no resolved cell(${targetCellName}) for '${driver}' driver`,
      NetErrorCode.NoResolvedCell,
    ),

  NoResolvedDriver: (driver, dest) =>
    new NetError(
      `There is no resolved driver(${driver}) for sending request to '${dest}'`,
      NetErrorCode.NoResolvedDriver,
    ),

  NoServiceHandler: (driver, dest) =>
    new NetError(
      `Service handler(driver: ${driver}) is not defined for '${dest}'`,
      NetErrorCode.NoServiceHandler,
    ),

  AnonymousAccessPrivateService: () =>
    new NetError(
      'Service handler has private scope is not accessible from anonymous caller',
      NetErrorCode.AnonymousAccessPrivateService,
    ),

  OtherCellAccessPrivateService: () =>
    new NetError(
      'Service handler has private scope is only accessible from owner cell',
      NetErrorCode.OtherCellAccessPrivateService,
    ),

  AnonymousAccessSpaceService: () =>
    new NetError(
      'Service handler has space scope is not accessible from anonymous caller',
      NetErrorCode.AnonymousAccessSpaceService,
    ),

  SpaceScopeForbidden: () =>
    new NetError(
      'Service handler has space scope is only accessible from cells having same space',
      NetErrorCode.SpaceScopeForbidden,
    ),
};
