import { GenericProvider, AdjustedProvider, AdjustedDep } from "../";
import { DiResolvers } from "../consts/di-resolver.const"
import { CycleTypeMap } from "../consts/cycle.const"
import { BaseProvider, ProviderHasCycle } from "../types";
import { isClass } from "./isClass.func";

/**
 * Classify provider into useModule, useClass, useFunc or useValue provider
 * and assign appropriate resolver for resolving dependency later.
 */
export function classifyProvider<T>(genericProvider: GenericProvider<T>): AdjustedProvider<T> {
  let adjustedProvider: AdjustedProvider<T>;

  if ((genericProvider as BaseProvider).token) {
    adjustedProvider = { ...genericProvider } as AdjustedProvider<T>;
  } else {
    adjustedProvider = {
      token: genericProvider,
      useClass: genericProvider,
    } as AdjustedProvider<T>;
  }

  // convert cycle(string) to cycle(number)
  if ((genericProvider as ProviderHasCycle).cycle) {
    adjustedProvider.cycle = CycleTypeMap[(genericProvider as ProviderHasCycle).cycle];
  }

  if (adjustedProvider.useModule !== undefined)
    adjustedProvider.resolver = DiResolvers.useModuleResolver;

  else if (adjustedProvider.useClass !== undefined)
    adjustedProvider.resolver = DiResolvers.useClassResolver;

  else if (adjustedProvider.useFunc !== undefined) {
    adjustedProvider.resolver = DiResolvers.useFuncResolver;
    adjustedProvider.deps = classifyUseFuncDeps(adjustedProvider.deps);
  }

  else adjustedProvider.resolver = DiResolvers.useValueResolver;

  return adjustedProvider;
}

function classifyUseFuncDeps(deps): AdjustedDep[] {
  return (deps || []).map(dep => {
    if(!isClass(dep)) {
      return { value: dep };
    }

    return { value: dep, isClass: true };
  });
}