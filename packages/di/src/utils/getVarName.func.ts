export function getVarName(aVar) {
  if (aVar && aVar.name) return aVar.name;

  if (typeof aVar === "string") return aVar;

  if (typeof aVar === "symbol") return aVar.toString();

  return aVar;
}