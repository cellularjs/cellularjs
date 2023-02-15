type WpRequireCtxMap = {
  [k: string]: { [k: string | symbol]: any };
};

export function createRequireContextMock(
  map: WpRequireCtxMap,
): __WebpackModuleApi.RequireContext {
  const MockContext: __WebpackModuleApi.RequireContext = (k: string) => {
    return map[k];
  };

  MockContext.id = '';

  MockContext.keys = () => Object.keys(map);

  MockContext.resolve = function (id: string) {
    return id;
  };

  return MockContext;
}
