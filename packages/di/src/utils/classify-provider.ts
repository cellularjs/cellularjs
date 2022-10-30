import {
  GenericProvider,
  ClassifiedProvider,
  ClassifiedUseFuncDep,
  ForwardRef,
  Provider,
  ProviderHasToken,
  ProviderHasCycle,
} from '../internal';
import { DiCycle } from '../consts/cycle.const';
import { isClass } from './is-class';
import { useModuleResolver } from '../core-resolver/use-module.resolver';
import { useClassResolver } from '../core-resolver/use-class.resolver';
import { useFuncResolver } from '../core-resolver/use-func.resolver';
import { useExistingResolver } from '../core-resolver/use-existing.resolver';
import { useValueResolver } from '../core-resolver/use-value.resolver';

/**
 * Classify provider into useModule, useClass, useFunc, useValue provider,...
 * and assign appropriate resolver for resolving dependency later.
 *
 * @since 0.1.0
 */
export function classifyProvider<T>(
  genericProvider: GenericProvider<T>,
): Provider {
  const rawProvider = initRawProvider(genericProvider);
  const cycle =
    DiCycle[(genericProvider as ProviderHasCycle).cycle] || DiCycle.transient;

  if (rawProvider.useModule !== undefined) {
    return new Provider({
      cycle,
      token: rawProvider.token,
      resolver: useModuleResolver,
      meta: { useModule: rawProvider.useModule },
    });
  }

  if (rawProvider.useClass !== undefined) {
    return new Provider({
      cycle,
      token: rawProvider.token,
      resolver: useClassResolver,
      meta: { useClass: rawProvider.useClass },
    });
  }

  if (rawProvider.useFunc !== undefined) {
    return new Provider({
      cycle,
      token: rawProvider.token,
      resolver: useFuncResolver,
      meta: {
        useFunc: rawProvider.useFunc,
        deps: classifyUseFuncDeps(rawProvider.deps),
      },
    });
  }

  if (rawProvider.useExisting !== undefined) {
    return new Provider({
      cycle,
      token: rawProvider.token,
      resolver: useExistingResolver,
      meta: { useExisting: rawProvider.useExisting },
    });
  }

  return new Provider({
    cycle,
    token: rawProvider.token,
    resolver: useValueResolver,
    meta: { useValue: rawProvider.useValue },
  });
}

function initRawProvider(genericProvider): ClassifiedProvider<any> {
  if ((<ProviderHasToken>genericProvider).token) {
    return genericProvider;
  }

  return {
    token: genericProvider,
    useClass: genericProvider,
  } as ClassifiedProvider;
}

function classifyUseFuncDeps(deps: any[]): ClassifiedUseFuncDep[] {
  return (deps || []).map((dep) => {
    if (isClass(dep)) {
      return { value: () => dep, shouldResolve: true };
    }

    if (dep instanceof ForwardRef) {
      return { value: dep.callback, shouldResolve: true };
    }

    return { value: dep, shouldResolve: false };
  });
}
