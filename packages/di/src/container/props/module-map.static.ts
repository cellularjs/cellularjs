import { ClassType, Container } from '../../'

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
export const moduleMap = new Map<(ClassType<any>), Container>();
