/**
 * @since 0.1.0
 */
export function isClass(aVar) {
  // https://github.com/miguelmota/is-class/blob/master/is-class.js
  return typeof aVar === 'function' && /^class[\s{]/.test(aVar.toString());
}
