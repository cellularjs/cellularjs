import { ClassifiedUseFuncDep, Provider, ResolveOptions } from '../internal';
import { Container } from '../container';

type UseFuncProvider = Provider<{
  useFunc: (...args: any[]) => any;
  deps: ClassifiedUseFuncDep[];
}>;

export async function useFuncResolver<T>(
  container: Container,
  provider: UseFuncProvider,
  options: ResolveOptions,
): Promise<T> {
  const useFuncArgs = await resolveUseFuncDeps(
    container,
    provider.meta.deps,
    options,
  );

  return await provider.meta.useFunc(...useFuncArgs);
}

async function resolveUseFuncDeps(
  container: Container,
  deps: ClassifiedUseFuncDep[],
  options: ResolveOptions,
): Promise<any[]> {
  const resolvedValues = [];

  for (let i = 0; i < deps.length; i++) {
    const dep = deps[i];

    if (!dep.shouldResolve) {
      resolvedValues.push(dep.value);
      continue;
    }

    resolvedValues.push(await container.resolve(dep.value(), options));
  }

  return resolvedValues;
}
