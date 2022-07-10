import {
  GenericProvider,
  Token,
  ExportableCnf,
  ClassifiedProvider,
  ImportableCnf,
  ClassType,
} from '../types';
import { DiResolvers } from '../consts/di-resolver.const';
import { addExtModule } from './funcs/addExtModule.func';
import { addModuleToMap } from './funcs/addModuleToMap.func';
import { addModule } from './funcs/addModule.func';
import { addProvider } from './funcs/addProvider.func';
import { addExports } from './funcs/addExports.func';
import { addModuleExports } from './funcs/addModuleExports.func';
import { innerResolve, resolve } from './funcs/resolve.func';
import { resolveUseFuncDeps } from './funcs/resolveUseFuncDeps.func';
import { resolveWithParentModule } from './funcs/resolveWithParentModule.func';
import { resolveConstructorArgs } from './funcs/resolveConstructorArgs.func';
import { resolveUseModuleProvider } from './funcs/resolveUseModuleProvider.func';
import { resolveUseClassProvider } from './funcs/resolveUseClassProvider.func';
import { resolveUseFuncProvider } from './funcs/resolveUseFuncProvider.func';
import { resolveUseValueProvider } from './funcs/resolveUseValueProvider.func';
import { resolveUseExistingProvider } from './funcs/resolveUseExistingProvider.func';

export class Container {
  /**
   * A store for cached resolved values.
   */
  protected _resolvedValues = new Map<Token, any>();

  /**
   * List of providers containing information for how to create dependency value.
   */
  protected _providers = new Map<Token, ClassifiedProvider>();

  /**
   * List of modules that current module/container use as reference for resolving
   * dependency value.
   */
  protected _extModules = new Map<ClassType, Container>();

  /**
   * `_parentModule` is a module that this module extend from.
   */
  protected _parentModule: Container;

  constructor(private moduleClass?: ClassType) {}

  public getModuleClass() {
    return this.moduleClass;
  }

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

  protected _innerResolve = innerResolve;

  protected _addExtModule = addExtModule;

  protected _addModuleToMap = addModuleToMap;

  protected _addModuleExports = addModuleExports;

  /**
   * Add service classes from ExportableCnf[] into container as providers.
   */
  protected _addExports = addExports;

  protected _resolveWithParentModule = resolveWithParentModule;

  protected _resolveConstructorArgs = resolveConstructorArgs;

  protected _resolveUseFuncArgs = resolveUseFuncDeps;

  protected [DiResolvers.useModuleResolver] = resolveUseModuleProvider;

  protected [DiResolvers.useClassResolver] = resolveUseClassProvider;

  protected [DiResolvers.useFuncResolver] = resolveUseFuncProvider;

  protected [DiResolvers.useValueResolver] = resolveUseValueProvider;

  protected [DiResolvers.useExistingResolver] = resolveUseExistingProvider;
}
