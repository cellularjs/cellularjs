export function freezeProperty(obj, key, value) {
  return Object.defineProperty(obj, key, {
    value,
    configurable: false,
    writable: false,
  });
}