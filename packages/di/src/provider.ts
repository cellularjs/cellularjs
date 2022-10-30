import { Token, DiCycle, Container, ResolveOptions } from './internal';

interface ProviderData<Meta = any> {
  token: Token;
  cycle: DiCycle;
  resolver(
    container: Container,
    provider: Provider,
    resolveOptions: ResolveOptions,
  ): any;
  meta: Meta;
}

/**
 * @since 0.11.0
 */
export class Provider<Meta = any> {
  constructor(private data: ProviderData<Meta>) {}

  get cycle() {
    return this.data.cycle;
  }

  get token(): Token {
    return this.data.token;
  }

  get meta(): Meta {
    return this.data.meta;
  }

  get resolver() {
    return this.data.resolver;
  }
}
