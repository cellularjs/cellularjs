module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: [ "**/node_modules"],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "indent": ["error", 2],
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/explicit-function-return-type": ["error"],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "no-multiple-empty-lines": ["error", { "max": 1 }],
    "quotes": ["error", "single"],
    "max-len": ["error", { "code": 120 }],
    "complexity": ["error", 20],
    "comma-dangle": ["error", "always-multiline"],
  }
}