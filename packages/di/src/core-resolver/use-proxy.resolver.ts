import { Provider, ResolveOptions } from '../internal';
import { Container } from '../container';
import { ProxyRunner, ProxyConfig } from '../proxy';

export type UseProxyResolverMeta = {
  proxiesCnfs: ProxyConfig[];
  targetProvider: Provider;
};

export async function useProxyResolver(
  container: Container,
  provider: Provider<UseProxyResolverMeta>,
  options: ResolveOptions,
) {
  return await new ProxyRunner(container, provider, options).run();
}
