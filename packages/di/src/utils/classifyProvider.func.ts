import { GenericProvider, ClassifiedProvider, ClassifiedUseFuncDep, ForwardRef } from '../internal';
import { DiResolvers } from '../consts/di-resolver.const'
import { CycleTypeMap } from '../consts/cycle.const'
import { ProviderHasToken, ProviderHasCycle } from '../types';
import { isClass } from './isClass.func';

/**
 * Classify provider into useModule, useClass, useFunc, useValue provider,...
 * and assign appropriate resolver for resolving dependency later.
 */
export function classifyProvider<T>(genericProvider: GenericProvider<T>): ClassifiedProvider<T> {
  let classifiedProvider: ClassifiedProvider<T>;

  if ((<ProviderHasToken>genericProvider).token) {
    classifiedProvider = { ...genericProvider } as ClassifiedProvider<T>;
  } else {
    classifiedProvider = {
      token: genericProvider,
      useClass: genericProvider,
    } as ClassifiedProvider<T>;
  }

  // convert cycle(string) to cycle(number)
  if ((genericProvider as ProviderHasCycle).cycle) {
    classifiedProvider.cycle = CycleTypeMap[(genericProvider as ProviderHasCycle).cycle];
  }

  if (classifiedProvider.useModule !== undefined)
    classifiedProvider.resolver = DiResolvers.useModuleResolver;

  else if (classifiedProvider.useClass !== undefined)
    classifiedProvider.resolver = DiResolvers.useClassResolver;

  else if (classifiedProvider.useFunc !== undefined) {
    classifiedProvider.resolver = DiResolvers.useFuncResolver;
    classifiedProvider.deps = classifyUseFuncDeps(classifiedProvider.deps);
  }

  else classifiedProvider.resolver = DiResolvers.useValueResolver;

  return classifiedProvider;
}

function classifyUseFuncDeps(deps: any[]): ClassifiedUseFuncDep[] {
  return (deps || []).map(dep => {
    if(isClass(dep)) {
      return { value: () => dep, shouldResolve: true };
    }

    if (dep instanceof ForwardRef) {
      return { value: dep.callback, shouldResolve: true };
    }

    return { value: dep, shouldResolve: false };
  });
}