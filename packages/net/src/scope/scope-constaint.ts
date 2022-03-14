import {
  ResolvedCell,
  Errors,
  ServiceScopeMap,
  getResolvedCell,
  ToTargetHeader,
} from '../internal';

export const scopeContraints = {
  [ServiceScopeMap.private]: privateContraint,
  [ServiceScopeMap.space]: spaceConstaint,
  [ServiceScopeMap.publish]: () => {},
};

function privateContraint(
  targetResolvedCell: ResolvedCell,
  referer?: ToTargetHeader,
) {
  if (!referer) {
    throw Errors.AnonymousAccessPrivateService();
  }

  const refererCell = referer.split(':')[0];
  const refererResolvedCell = getResolvedCell(refererCell);

  if (refererResolvedCell.cellId !== targetResolvedCell.cellId) {
    throw Errors.OtherCellAccessPrivateService();
  }
}

function spaceConstaint(
  targetResolvedCell: ResolvedCell,
  referer?: ToTargetHeader,
) {
  if (!referer) {
    throw Errors.AnonymousAccessSpaceService();
  }

  const refererCell = referer.split(':')[0];
  const refererResolvedCell = getResolvedCell(refererCell);

  if (refererResolvedCell.spaceId !== targetResolvedCell.spaceId) {
    throw Errors.SpaceScopeForbidden();
  }
}
