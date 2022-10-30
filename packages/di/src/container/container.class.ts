import {
  GenericProvider,
  Token,
  ExportableCnf,
  ImportableCnf,
  ClassType,
} from '../types';
import { addModule } from './funcs/add-module.func';
import { addProvider } from './funcs/add-provider.func';
import { resolve } from './funcs/resolve.func';
import { Provider } from '../internal';

/**
 * @see https://cellularjs.com/docs/foundation/dependency-injection/basic-usage
 * @since 0.1.0
 */
export class Container {
  /**
   * A store for cached resolved values.
   */
  protected _resolvedValues = new Map<Token, any>();

  /**
   * List of providers containing information for how to create dependency value.
   */
  protected _providers = new Map<Token, Provider>();

  /**
   * List of modules that current module/container use as reference for resolving
   * dependency value.
   */
  protected _extModules = new Map<ClassType, Container>();

  constructor(protected moduleClass?: ClassType) {}

  /**
   * @since 0.11.0
   */
  public hasExtModule(moduleClass: ClassType) {
    return this._extModules.has(moduleClass);
  }

  /**
   * @since 0.11.0
   */
  public getExtModule(moduleClass: ClassType) {
    return this._extModules.get(moduleClass);
  }

  /**
   * Convenient method for adding multiple providers into this container.
   *
   * @since 0.1.0
   */
  public async addProviders(providers: GenericProvider[] = []): Promise<void> {
    for (let i = 0; i < providers.length; i++) {
      await this.addProvider(providers[i]);
    }
  }

  /**
   * Add a provider into this container for resolving dependency later.
   *
   * @since 0.1.0
   */
  public addProvider = addProvider;

  /**
   * Convenient method for adding multiple modules into this container.
   *
   * @since 0.1.0
   */
  public async addModules(modules: (ImportableCnf | ExportableCnf)[] = []) {
    for (let i = 0; i < modules.length; i++) {
      await this.addModule(modules[i]);
    }
  }

  /**
   * Add a module into this container.
   *
   * @since 0.1.0
   */
  public addModule = addModule;

  /**
   * Check if a provider with given token exists in this container.
   *
   * @since 0.1.0
   */
  public has(token: Token): boolean {
    return this._providers.has(token);
  }

  /**
   * Remove provider from this container by token.
   *
   * @since 0.1.0
   */
  public remove(token: Token) {
    this._providers.delete(token);
  }

  /**
   * Resolve value by token.
   *
   * @since 0.1.0
   */
  public resolve = resolve;
}
