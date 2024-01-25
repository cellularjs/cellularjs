export * from './scan-js';
export * from './lookup-service-handler';
export * from './lookup-providers';
export * from './normalize-irs';
export * from './reflect-meta';
export * from './uniq-id';

/**
 * @see https://webpack.js.org/guides/dependency-management/#context-module-api
 */
export function importAll(r: __WebpackModuleApi.RequireContext) {
  return r.keys().map((key) => r(key));
}
