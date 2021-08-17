import {
  ControlPlane,
  CellContext, ResolvedCell, Errors,
  ServiceScopeMap
} from "../";

/**
 * Service scope constraint
 */
export class ScopeConstaint {
  public static [ServiceScopeMap.private](targetResolvedCell: ResolvedCell, refererCell?: CellContext) {
    if (!refererCell) {
      throw Errors.AnonymousAccessPrivateService();
    }

    const refererResolvedCell = ControlPlane.getResolvedCell(refererCell.cellName);

    if (refererResolvedCell.cellId !== targetResolvedCell.cellId) {
      throw Errors.OtherCellAccessPrivateService();
    }
  }

  public static [ServiceScopeMap.space](targetResolvedCell: ResolvedCell, refererCell?: CellContext) {
    if (!refererCell) {
      throw Errors.AnonymousAccessSpaceService();
    }

    const refererResolvedCell = ControlPlane.getResolvedCell(refererCell.cellName);

    if (refererResolvedCell.spaceId !== targetResolvedCell.spaceId) {
      throw Errors.SpaceScopeForbidden();
    }
  }

  public static [ServiceScopeMap.public]() { }
}