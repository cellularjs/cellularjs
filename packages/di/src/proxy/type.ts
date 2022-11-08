import { ClassType } from '../types';

/**
 * @since 0.11.0
 */
export type ProxyConfig = {
  proxy: ClassType;
  meta?: ProxyMeta;
};

/**
 * @since 0.11.0
 */
export type ProxyMeta = any;

/**
 * @since 0.11.0
 */
export interface ProxyHandler {
  handle(): Promise<any> | any;
}
