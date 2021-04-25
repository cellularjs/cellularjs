import { Container } from '../../';
import { AdjustedDep } from "../../types";

export function resolveUseFuncArgs(this: Container, deps: AdjustedDep[]): any[] {
  return deps.map(dep => {
    if (dep.isClass) return this.resolve(dep.value);

    return dep.value;
  });
}