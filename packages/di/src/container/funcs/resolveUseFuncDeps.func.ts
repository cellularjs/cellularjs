import { Container, ResolveOptions } from '../..';
import { ClassifiedUseFuncDep } from '../../internal';

export async function resolveUseFuncDeps(
  this: Container,
  deps: ClassifiedUseFuncDep[],
  options: ResolveOptions,
): Promise<any[]> {
  const resolvingDeps = deps.map(dep =>
    dep.shouldResolve
      ? this.resolve(dep.value(), options)
      : dep.value,
  );

  return Promise.all(resolvingDeps);
}