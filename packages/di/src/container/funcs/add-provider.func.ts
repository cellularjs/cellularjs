import { useModuleResolver } from '../../core-resolver/use-module.resolver';
import { Container } from '../..';
import { Errors } from '../../consts/error.const';
import { GenericProvider, ProviderHasToken } from '../../types';
import { classifyProvider } from '../../utils';
import { addModuleToMap } from './add-module-to-map.func';

/**
 * @since 0.1.0
 */
export async function addProvider<T>(
  this: Container,
  genericProvider: GenericProvider<T>,
) {
  const token = (<ProviderHasToken>genericProvider).token || genericProvider;
  if (this._providers.has(token)) {
    throw Errors.DuplicateToken(token);
  }

  const provider = classifyProvider(genericProvider);

  // make sure module exists when resolving useModule provider
  if (provider.resolver === useModuleResolver) {
    await addModuleToMap.call(this, provider.meta.useModule);
  }

  this._providers.set(provider.token, provider);
}
