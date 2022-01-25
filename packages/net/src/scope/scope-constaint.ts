import {
  ResolvedCell,
  Errors,
  ServiceScopeMap,
  getResolvedCell,
} from '../internal';

export const scopeContraints = {
  [ServiceScopeMap.private]: privateContraint,
  [ServiceScopeMap.space]: spaceConstaint,
  [ServiceScopeMap.publish]: () => {},
};

function privateContraint(
  targetResolvedCell: ResolvedCell,
  refererCell?: string,
) {
  if (!refererCell) {
    throw Errors.AnonymousAccessPrivateService();
  }

  const refererResolvedCell = getResolvedCell(refererCell);

  if (refererResolvedCell.cellId !== targetResolvedCell.cellId) {
    throw Errors.OtherCellAccessPrivateService();
  }
}

function spaceConstaint(
  targetResolvedCell: ResolvedCell,
  refererCell?: string,
) {
  if (!refererCell) {
    throw Errors.AnonymousAccessSpaceService();
  }

  const refererResolvedCell = getResolvedCell(refererCell);

  if (refererResolvedCell.spaceId !== targetResolvedCell.spaceId) {
    throw Errors.SpaceScopeForbidden();
  }
}
