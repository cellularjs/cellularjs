import { Container } from './container';
import { ClassType } from './internal';

/**
 * Module map, or container map. It know all modules that were imported before.
 *
 * ```ts
 * // Module map look like this:
 * const ModuleMap = {
 *   ModuleA: {
 *     _providers: {
 *       ServiceA: { token: ServiceA, meta: { useClass: ServiceA }, resolver: function },
 *     },
 *   },
 *   ModuleB: {
 *     _providers: {
 *       ServiceA: { token: ServiceA, meta: { useModule: ModuleA }, resolver: function },
 *       ServiceB: { token: ServiceB, meta: { useClass: ServiceB }, resolver: function },
 *     },
 *     _extModules: {
 *       ModuleA: {
 *         _providers: {
 *           "config": { token: "config", meta: { useValue: "******" }, resolver: function },
 *           ReservedService: { token: ReservedService, meta: { useClass: ReservedService }, resolver: function },
 *         },
 *       },
 *     },
 *   },
 * };
 * ```
 *
 * @since 0.1.0
 */
export const moduleMap = new Map<ClassType, Container>();

/**
 * _**IMPORTANT**: this function can make @cellularjs/di work incorrectly,
 * it should be used for development only(like unit testing)._
 * @since 0.9.0
 */
export function clearModuleMap() {
  moduleMap.clear();
}
