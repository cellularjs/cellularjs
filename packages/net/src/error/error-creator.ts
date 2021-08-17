import { ErrorCode, NetError } from '.'

export const Errors= {
  DuplicateCellName: (cellName) => new NetError(
    `Cell name '${cellName}' is duplicated`,
    ErrorCode.DuplicateCellName,
  ),

  InvalidDriverClass: entry => new NetError(
    `Driver must be a class, '${entry}' does not point to class`,
    ErrorCode.InvalidDriverClass,
  ),

  DuplicateServiceHandlerName: (eventName, cellName) => new NetError(
    `Service handler name for '${eventName}' is duplicated in '${cellName}' cell`,
    ErrorCode.DuplicateServiceHandlerName,
  ),

  NoResolvedCell: (targetCellName, driverType) => new NetError(
    `There is no resolved cell(${targetCellName}) for '${driverType}' driver`,
    ErrorCode.NoResolvedCell,
  ),

  NoResolvedDriver: (driverType, dest) => new NetError(
    `There is no resolved driver(${driverType}) for sending request to '${dest}'`,
    ErrorCode.NoResolvedDriver,
  ),

  NoServiceHandler: (driverType, dest) => new NetError(
    `Service handler(driver: ${driverType}) is not defined for '${dest}'`,
    ErrorCode.NoServiceHandler,
  ),

  AnonymousAccessPrivateService: () => new NetError(
    `Service handler has private scope is not accessible from anonymous caller`,
    ErrorCode.AnonymousAccessPrivateService,
  ),

  OtherCellAccessPrivateService: () => new NetError(
    `Service handler has private scope is only accessible from owner cell`,
    ErrorCode.OtherCellAccessPrivateService,
  ),

  AnonymousAccessSpaceService: () => new NetError(
    `Service handler has space scope is not accessible from anonymous caller`,
    ErrorCode.AnonymousAccessSpaceService,
  ),

  SpaceScopeForbidden: () => new NetError(
    `Service handler has space scope is only accessible from cells having same space`,
    ErrorCode.SpaceScopeForbidden,
  ),
};
