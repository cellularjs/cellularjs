import { Container } from '../..';
import { ClassifiedUseFuncDep, InnerResolveOptions } from '../../internal';

export async function resolveUseFuncDeps(
  this: Container,
  deps: ClassifiedUseFuncDep[],
  options: InnerResolveOptions,
): Promise<any[]> {
  const resolvedValues = [];

  for (let i = 0; i < deps.length; i++) {
    const dep = deps[i];

    if (!dep.shouldResolve) {
      resolvedValues.push(dep.value);
      continue;
    }

    resolvedValues.push(await this._innerResolve(dep.value(), options));
  }

  return resolvedValues;
}
