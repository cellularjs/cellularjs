import { Container, globalContainer } from '../';
import { Token, GenericProvider, BaseProvider } from "../../types";

export function resolveWithTmpGlobalProviders<T>(this: Container, token: Token, providers: GenericProvider<any>[]): Promise<T> {
  try {
    globalContainer.addProviders(providers);

    return this.resolve<T>(token);
  } finally {
    cleanTmpGlobalProviders(providers);
  }
}

function cleanTmpGlobalProviders(providers: GenericProvider<any>[]) {
  providers.forEach(provider => {
    if ((provider as BaseProvider).token) {
      globalContainer.remove((provider as BaseProvider).token);
      return;
    }

    globalContainer.remove(provider);
  });
}