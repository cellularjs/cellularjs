import { Container } from '../../';
import { Errors } from '../../consts/error.const';
import { GenericProvider, ProviderHasToken } from '../../types';
import { classifyProvider } from '../../utils';

export async function addProvider<T>(
  this: Container,
  genericProvider: GenericProvider<T>,
) {
  const token = (<ProviderHasToken>genericProvider).token || genericProvider;
  if (this._providers.has(token)) {
    throw Errors.DuplicateToken(token);
  }

  const adjustedProvider = classifyProvider(genericProvider);

  // make sure module exists when resolving useModule provider
  if (adjustedProvider.useModule !== undefined) {
    await this._addModuleToMap(adjustedProvider.useModule);
  }

  this._providers.set(adjustedProvider.token, adjustedProvider);
}
