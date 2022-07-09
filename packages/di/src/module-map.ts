import { ClassType, Container } from './internal';

/**
 * Module map, or container map. It know all modules that were imported before.
 *
 * ```ts
 * // Module map look like this:
 * const ModuleMap = {
 *   ModuleA: {
 *     _providers: {
 *       ServiceA: { token: ServiceA, useClass: ServiceA, resolver: 1 },
 *     },
 *   },
 *   ModuleB: {
 *     _providers: {
 *       ServiceA: { token: ServiceA, useModule: ModuleA, resolver: 0 },
 *       ServiceB: { token: ServiceB, useClass: ServiceB, resolver: 1 },
 *     },
 *     _extModules: {
 *       ModuleA: {
 *         _providers: {
 *           "config": { token: "config", useValue: "******", resolver: 3 },
 *           ReservedService: { token: ReservedService, useClass: ReservedService, resolver: 1 },
 *         },
 *       },
 *     },
 *   },
 * };
 * ```
 */
export const moduleMap = new Map<ClassType, Container>();

/**
 * IMPORTANT: this function can make @cellularjs/di work incorrectly,
 * it should be used for development only(like unit testing).
 *
 * @deprecated This function is not deprecated, it is just to denote
 * that you should not use this function.
 */
export function clearModuleMap() {
  console.log(
    '"clearModuleMap" is invoked, this function can make @cellularjs/di work incorrectly, ' +
      'it should be used for development only(like unit testing).',
  );

  moduleMap.clear();
}
