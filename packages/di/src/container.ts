import { Errors } from "./error";
import { getModuleMeta, getParamTypes, getToken, classifyProvider } from "./utils";
import {
  GenericProvider, AdjustedProvider, AdjustedDep, ClassType,
  DiResolvers, Token, PermanentCycle,
  ExtModuleMeta, ExportableCnf, ImportableCnf,
} from "./type";

export class Container {
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
  private static _ModuleMap = new Map<ClassType<any>, Container>();

  /**
   * A store for cached resolved values.
   */
  private _resolvedValues = new Map<Token, any>();

  /**
   * List of providers containing information for how to create dependency value.
   */
  private _providers = new Map<Token, AdjustedProvider<any>>();

  /**
   * List of modules that current module/container use as reference for resolving
   * dependency value.
   */
  private _extModules = new Map<ClassType<any>, Container>();

  /**
   * _refModule is a module that _extModule extend from. It help "extend" become real.
   */
  private _refModule: Container;

  /**
   * _extModule hold "extend stuffs"(Eg: providers).
   * 
   * **Notice**: *this temporay property will be deleted right after resolving value.*
   */
  private _extModule: Container;

  /**
   * Convenient method for adding multiple providers into this container.
   */
  public addProviders(providers: GenericProvider<any>[] = []): void {
    providers.forEach(provider => this.addProvider(provider));
  }

  /**
   * Add a provider into this container for resolving dependency later.
   */
  public addProvider<T>(genericProvider: GenericProvider<T>) {
    this._errorOnDuplicateToken(
      (genericProvider as AdjustedProvider<T>).token ||
      genericProvider
    );

    const adjustedProvider = classifyProvider(genericProvider);

    // make sure module exists when resolving useModule provider
    if (adjustedProvider.useModule !== undefined) {
      this._addModuleToMap(adjustedProvider.useModule);
    }

    this._providers.set(adjustedProvider.token, adjustedProvider);
  }

  /**
   * Convenient method for adding multiple modules into this container.
   */
  public addModules(modules: (ImportableCnf | ExportableCnf)[] = []) {
    modules.forEach(module => this.addModule(module));
  }

  /**
   * Add a module into this container.
   */
  public addModule(moduleCnf: ImportableCnf | ExportableCnf): void {
    if ((moduleCnf as ExtModuleMeta).extModule) {
      this._addExtModule(moduleCnf as ExtModuleMeta);
      return;
    }

    const moduleMeta = getModuleMeta(moduleCnf);
    if (!moduleMeta) {
      throw Errors.InvalidModuleClass(moduleCnf);
    }

    this._addModuleExports(moduleCnf as ClassType<any>, moduleMeta.exports);
    this._addModuleToMap(moduleCnf as ClassType<any>);
  }

  /**
   * Check if a provider with given token exists in this container.
   */
  public has(token: Token): boolean {
    return this._providers.has(token);
  }

  /**
   * Resolve value by token.
   */
  public resolve<T>(token: Token): T {
    if (this._extModule && this._extModule.has(token)) {
      return this._extModule._resolveWithRefModule(token, this);
    }

    const provider = this._providers.get(token);
    if (!provider) {
      const shouldThrow = !this._refModule || !this._refModule.has(token);
      if (shouldThrow) throw Errors.NoProviderForToken(token);

      return this._refModule.resolve(token);
    }

    return this[provider.resolver](provider);
  }

  /**
   * Resolve value by token and temporary providers.
   */
  public resolveWithProviders<T>(token: Token, providers: GenericProvider<any>[]): T {
    const extModule = new Container();
    extModule.addProviders(providers);

    return this._resolveWithExtModule<T>(token, extModule);
  }

  private _resolveWithRefModule<T>(token: Token, refModule: Container): T {
    this._refModule = refModule;
    const resolvedValue = this.resolve<T>(token);

    return resolvedValue;
  }

  private _resolveWithExtModule<T>(token: Token, extModule: Container): T {
    this._extModule = extModule;
    const resolvedValue = this.resolve<T>(token);
    delete this._extModule;

    return resolvedValue;
  }

  private _addExtModule(extModuleMeta: ExtModuleMeta) {
    this.addModule(extModuleMeta.extModule);

    const extModule = new Container();
    extModule.addProviders(extModuleMeta.providers);

    (extModuleMeta.exports || []).forEach(exportCnf => {
      const moduleMeta = getModuleMeta(exportCnf);
      if (moduleMeta) {
        this.addModule(exportCnf);
        return;
      }

      this.addProvider({
        token: exportCnf,
        useModule: extModuleMeta.extModule,
      });

      extModule.addProvider(exportCnf as ClassType<any>);
    });

    extModule.addModules(extModuleMeta.imports);

    this._extModules.set(extModuleMeta.extModule, extModule);
  }

  /**
   * @param moduleClass Module class is a class decorated by `@Module` annotation.
   */
  private _addModuleToMap(moduleClass: ClassType<any>): void {
    if (Container._ModuleMap.has(moduleClass)) {
      return;
    }

    const moduleMeta = getModuleMeta(moduleClass);
    if (!moduleMeta) {
      throw Errors.InvalidModuleClass(moduleClass);
    }

    const module = new Container();

    module._addExportServicesAsProviders(moduleMeta.exports);
    module.addProviders(moduleMeta.providers);
    module.addModules(moduleMeta.imports);

    Container._ModuleMap.set(moduleClass, module);
  }

  /**
   * Add service classes from ExportableCnf[] into container as providers.
   */
  private _addExportServicesAsProviders(exports: ExportableCnf[] = []): void {
    exports.forEach((provider: ExportableCnf) => {
      // TODO: prevent complicate nested ExtendModule
      // if ((provider as ExtModuleMeta).extModule) throw;

      // ignore module class
      if (getModuleMeta(provider)) return;

      this.addProvider(provider as ClassType<any>);
    });
  }

  private _errorOnDuplicateToken(token): void {
    if (this._providers.has(token)) {
      throw Errors.DuplicateToken(token);
    }
  }

  private _resolveConstructorArgs(target): any[] {
    return getParamTypes(target).map((type, index) => {
      const paramType = getToken(target, index) || type;
      return this.resolve(paramType);
    });
  }

  private _resolveUseFuncArgs(deps: AdjustedDep[]): any[] {
    return deps.map(dep => {
      if (dep.isClass) return this.resolve(dep.value);

      return dep.value;
    });
  }

  private _addModuleExports(moduleClass: ClassType<any>, exports: ExportableCnf[] = []) {
    exports.forEach((exportCnf: ExportableCnf) => {
      const moduleMeta = getModuleMeta(exportCnf);
      if (moduleMeta || (exportCnf as ExtModuleMeta).extModule) {
        this.addModule(exportCnf);
        return;
      }

      this.addProvider({
        token: exportCnf as ClassType<any>,
        useModule: moduleClass,
      });
    });
  }

  /***************************************************************************
   * START: DI resolvers                                                     *
   ***************************************************************************/

  private [DiResolvers.useModuleResolver]<T>(provider: AdjustedProvider<T>): T {
    const moduleFromMap = Container._ModuleMap.get(provider.useModule);

    if (this._extModules.has(provider.useModule)) {
      const extModule = this._extModules.get(provider.useModule);
      return moduleFromMap._resolveWithExtModule(provider.token, extModule);
    }

    return moduleFromMap.resolve(provider.token);
  }

  private [DiResolvers.useClassResolver]<T>(provider: AdjustedProvider<T>): T {
    if (this._resolvedValues.has(provider.token)) {
      return this._resolvedValues.get(provider.token);
    }

    const args = this._resolveConstructorArgs(provider.useClass)
    const resolvedValue = Reflect.construct(provider.useClass, args);

    if (provider.cycle === PermanentCycle) {
      this._resolvedValues.set(provider.token, resolvedValue);
    }

    return resolvedValue;
  }

  private [DiResolvers.useFuncResolver]<T>(provider: AdjustedProvider<T>): T {
    if (this._resolvedValues.has(provider.token)) {
      return this._resolvedValues.get(provider.token);
    }

    const useFuncArgs = this._resolveUseFuncArgs(provider.deps);
    const resolvedValue = provider.useFunc(...useFuncArgs);

    if (provider.cycle === PermanentCycle) {
      this._resolvedValues.set(provider.token, resolvedValue);
    }

    return resolvedValue;
  }

  private [DiResolvers.useValueResolver]<T>(provider: AdjustedProvider<T>): T {
    return provider.useValue;
  }

  /***************************************************************************
   * END: DI resolvers                                                       *
   ***************************************************************************/
}