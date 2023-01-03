module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['**/node_modules'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': ['error', {
      'semi': true,
      'singleQuote': true,
      'trailingComma': 'all',
      'bracketSpacing': true,
      'endOfLine': 'lf',
    }],
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    'indent': ['error', 2],
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-empty-function': 'off',
    'no-multiple-empty-lines': ['error', { 'max': 1 }],
    'max-len': ['error', { 'code': 120 }],
    'complexity': ['error', 10],
    'comma-dangle': ['error', 'always-multiline'],
  },
};
