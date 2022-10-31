import {
  Container,
  ExportableCnf,
  GenericProvider,
  ImportableCnf,
  moduleMap,
} from './internal';

class GlobalModule {}

/**
 * @since 0.11.0
 */
export function getGlobalModule() {
  if (!moduleMap.has(GlobalModule)) {
    moduleMap.set(GlobalModule, new Container(GlobalModule));
  }

  return moduleMap.get(GlobalModule);
}

/**
 * @since 0.11.0
 */
export async function setGlobalModules(
  modules: (ImportableCnf | ExportableCnf)[],
) {
  await getGlobalModule().addModules(modules);
}

/**
 * @since 0.11.0
 */
export async function setGlobalProviders(providers: GenericProvider[]) {
  await getGlobalModule().addProviders(providers);
}
