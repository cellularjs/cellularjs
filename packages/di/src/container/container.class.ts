import { GenericProvider, Token, ExportableCnf, ImportableCnf } from '../types';
import { DiResolvers } from '../consts/di-resolver.const';
import { ContainerBag } from './props/container-bag.prop';
import { addExtModule } from './funcs/addExtModule.func';
import { addModuleToMap } from './funcs/addModuleToMap.func';
import { addModule } from './funcs/addModule.func';
import { addProvider } from './funcs/addProvider.func';
import { addExportServicesAsProviders } from './funcs/addExportServicesAsProviders.func';
import { addModuleExports } from './funcs/addModuleExports.func';
import { resolve } from './funcs/resolve.func';
import { resolveUseFuncDeps } from './funcs/resolveUseFuncDeps.func';
import { resolveWithParentModule } from './funcs/resolveWithParentModule.func';
import { resolveConstructorArgs } from './funcs/resolveConstructorArgs.func';
import { resolveUseModuleProvider } from './funcs/resolveUseModuleProvider.func';
import { resolveUseClassProvider } from './funcs/resolveUseClassProvider.func';
import { resolveUseFuncProvider } from './funcs/resolveUseFuncProvider.func';
import { resolveUseValueProvider } from './funcs/resolveUseValueProvider.func';
import { resolveUseExistingProvider } from './funcs/resolveUseExistingProvider.func';

export class Container extends ContainerBag {
  /**
   * Convenient method for adding multiple providers into this container.
   */
  public async addProviders(providers: GenericProvider[] = []): Promise<void> {
    for (let i = 0; i < providers.length; i++) {
      await this.addProvider(providers[i]);
    }
  }

  /**
   * Add a provider into this container for resolving dependency later.
   */
  public addProvider = addProvider;

  /**
   * Convenient method for adding multiple modules into this container.
   */
  public async addModules(modules: (ImportableCnf | ExportableCnf)[] = []) {
    for (let i = 0; i < modules.length; i++) {
      await this.addModule(modules[i]);
    }
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
   * Remove provider from this container by token.
   */
  public remove(token: Token) {
    this._providers.delete(token);
  }

  /**
   * Resolve value by token.
   */
  public resolve = resolve;

  protected _addExtModule = addExtModule;

  protected _addModuleToMap = addModuleToMap;

  protected _addModuleExports = addModuleExports;

  /**
   * Add service classes from ExportableCnf[] into container as providers.
   */
  protected _addExportServicesAsProviders = addExportServicesAsProviders;

  protected _resolveWithParentModule = resolveWithParentModule;

  protected _resolveConstructorArgs = resolveConstructorArgs;

  protected _resolveUseFuncArgs = resolveUseFuncDeps;

  protected [DiResolvers.useModuleResolver] = resolveUseModuleProvider;

  protected [DiResolvers.useClassResolver] = resolveUseClassProvider;

  protected [DiResolvers.useFuncResolver] = resolveUseFuncProvider;

  protected [DiResolvers.useValueResolver] = resolveUseValueProvider;

  protected [DiResolvers.useExistingResolver] = resolveUseExistingProvider;
}
