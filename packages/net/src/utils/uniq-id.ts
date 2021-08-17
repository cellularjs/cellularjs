let id = 0;
const idsMap = new Map<any, number>();

export function uniqId(anyVar): number {
  if (idsMap.has(anyVar)) {
    return idsMap.get(anyVar);
  }

  id += 1;
  idsMap.set(anyVar, id);

  return id;
}