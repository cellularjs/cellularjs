import { GenericProvider, Token, ExportableCnf, ImportableCnf } from "../types";
import { DiResolvers} from '../consts/di-resolver.const'
import { ContainerBag } from './props/container-bag.prop'
import { addExtModule } from './funcs/addExtModule.func'
import { addModuleToMap } from './funcs/addModuleToMap.func'
import { addModule } from './funcs/addModule.func'
import { addProvider } from './funcs/addProvider.func'
import { addExportServicesAsProviders } from './funcs/addExportServicesAsProviders.func'
import { addModuleExports } from './funcs/addModuleExports.func'
import { resolve } from './funcs/resolve.func'
import { resolveWithProviders } from './funcs/resolveWithProviders.func'
import { resolveUseFuncArgs } from './funcs/resolveUseFuncArgs.func'
import { resolveWithRefModule } from './funcs/resolveWithRefModule.func'
import { resolveWithExtModule } from './funcs/resolveWithExtModule.func'
import { resolveConstructorArgs } from './funcs/resolveConstructorArgs.func'
import { resolveModuleProvider } from './funcs/resolveModuleProvider.func'
import { resolveClassProvider } from './funcs/resolveClassProvider.func'
import { resolveFuncProvider } from './funcs/resolveFuncProvider.func'
import { resolveValueProvider } from './funcs/resolveValueProvider.func'

export class Container extends ContainerBag {
  /**
   * Convenient method for adding multiple providers into this container.
   */
  public addProviders(providers: GenericProvider<any>[] = []): void {
    providers.forEach(provider => this.addProvider(provider));
  }

  /**
   * Add a provider into this container for resolving dependency later.
   */
  public addProvider = addProvider;

  /**
   * Convenient method for adding multiple modules into this container.
   */
  public addModules(modules: (ImportableCnf | ExportableCnf)[] = []) {
    modules.forEach(module => this.addModule(module));
  }

  /**
   * Add a module into this container.
   */
  public addModule = addModule;

  /**
   * Check if a provider with given token exists in this container.
   */
  public has(token: Token): boolean {
    return this._providers.has(token);
  }

  /**
   * Resolve value by token.
   */
  public resolve = resolve;

  /**
   * Resolve value by token and temporary providers.
   */
  public resolveWithProviders = resolveWithProviders;

  protected _resolveWithRefModule = resolveWithRefModule;

  protected _resolveWithExtModule = resolveWithExtModule;

  protected _addExtModule = addExtModule;

  /**
   * @param moduleClass Module class is a class decorated by `@Module` annotation.
   */
  protected _addModuleToMap = addModuleToMap;

  protected _addModuleExports = addModuleExports;

  /**
   * Add service classes from ExportableCnf[] into container as providers.
   */
  protected _addExportServicesAsProviders = addExportServicesAsProviders;

  protected _resolveConstructorArgs = resolveConstructorArgs;

  protected _resolveUseFuncArgs = resolveUseFuncArgs;

  protected [DiResolvers.useModuleResolver] = resolveModuleProvider;

  protected [DiResolvers.useClassResolver] = resolveClassProvider;

  protected [DiResolvers.useFuncResolver] = resolveFuncProvider;

  protected [DiResolvers.useValueResolver] = resolveValueProvider;
}