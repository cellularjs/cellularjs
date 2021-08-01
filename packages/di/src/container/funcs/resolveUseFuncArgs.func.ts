import { Container, ResolveOptions, AdjustedDep } from '../../';

export async function resolveUseFuncArgs(
  this: Container,
  deps: AdjustedDep[],
  options: ResolveOptions,
): Promise<any[]> {
  const resolvingDeps = deps.map(dep =>
    dep.isClass
      ? this.resolve(dep.value, options)
      : dep.value,
  );

  return Promise.all(resolvingDeps);
}