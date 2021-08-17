import { Hook } from "../"
import { ResolvedCell } from "../type";

const resolvedCells = new Map<string, ResolvedCell>();

export function setResolvedCell(name: string, instance: ResolvedCell) {
  resolvedCells.set(name, instance)
}

export function getResolvedCell(cellName: string): ResolvedCell | undefined {
  return resolvedCells.get(cellName);
}

export async function cleanResolvedCells() {
  resolvedCells.clear();
  Hook.clean();
}
