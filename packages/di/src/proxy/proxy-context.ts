import { Container, Token } from '../';
import { ProxyMeta } from './type';

interface ProxyContextData<Meta> {
  next: () => Promise<void>;
  extModule: Container;
  token: Token;
  meta?: Meta;
}

/**
 * @since 0.11.0
 */
export class ProxyContext<Meta = ProxyMeta> {
  constructor(private data: ProxyContextData<Meta>) {}

  /**
   * Move to next pipe.
   * @since 0.11.0
   */
  next = (): Promise<any> => {
    return this.data.next();
  };

  /**
   * @example https://cellularjs.com/docs/how-to%20wiki/auth
   * @since 0.11.0
   */
  getExtModule = () => {
    return this.data.extModule;
  };

  /**
   * @since 0.11.0
   */
  get token() {
    return this.data.token;
  }

  /**
   * @since 0.11.0
   */
  get meta() {
    return this.data.meta;
  }
}
