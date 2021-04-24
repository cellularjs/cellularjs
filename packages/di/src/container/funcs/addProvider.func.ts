import { Errors } from "../../error";
import { GenericProvider, AdjustedProvider } from "../../type";
import { classifyProvider } from '../../utils'
import { Container } from '../../'

export function addProvider<T>(this: Container, genericProvider: GenericProvider<T>) {
  const token = (genericProvider as AdjustedProvider<T>).token ||  genericProvider;
  if (this._providers.has(token)) {
    throw Errors.DuplicateToken(token);
  }

  const adjustedProvider = classifyProvider(genericProvider);

  // make sure module exists when resolving useModule provider
  if (adjustedProvider.useModule !== undefined) {
    this._addModuleToMap(adjustedProvider.useModule);
  }

  this._providers.set(adjustedProvider.token, adjustedProvider);
}
