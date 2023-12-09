import { ResolvedCell } from '../type';

const resolvedCells = new Map<string, ResolvedCell>();

export function setResolvedCell(cellName: string, resolvedCell: ResolvedCell) {
  resolvedCells.set(cellName, resolvedCell);
}

export function getResolvedCell(cellName: string): ResolvedCell | undefined {
  return resolvedCells.get(cellName);
}

export function clearResolvedCells() {
  resolvedCells.clear();
}
