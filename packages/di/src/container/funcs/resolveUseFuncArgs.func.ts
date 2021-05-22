import { Container } from '../../';
import { AdjustedDep } from "../../types";

export async function resolveUseFuncArgs(this: Container, deps: AdjustedDep[]): Promise<any[]> {
  const resolvedDeps = [];

  for (let i = 0; i < deps.length; i++) {
    const dep = deps[i];

    if (!dep.isClass) {
      resolvedDeps.push(dep.value);
      continue;
    }

    resolvedDeps.push(this.resolve(dep.value));
  }

  return Promise.all(resolvedDeps);
}