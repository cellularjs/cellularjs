export function isClass(aVar) {
  return typeof aVar === "function" && /^\s*class\s+/.test(aVar.toString());
}