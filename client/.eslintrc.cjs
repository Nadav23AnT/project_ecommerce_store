/* eslint-disable @cspell/spellchecker */
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'standard-with-typescript',
    'plugin:prettier/recommended',
    'plugin:@cspell/recommended',
  ],
  plugins: ['prettier'],
  ignorePatterns: ['build'],
  root: true,
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        prefix: ['I'],
        format: ['UPPER_CASE', 'StrictPascalCase'],
      },
    ],
    '@cspell/spellchecker': ['error', { checkComments: true, autoFix: true }],
    '@typescript-eslint/no-unused-vars': 'error',
    'guard-for-in': 'off',
    'no-restricted-syntax': ['off', 'ForOfStatement'],
    'import/prefer-default-export': ['off'],
    'prettier/prettier': 'error',
    'linebreak-style': 'off',
    'no-console': 'error',
    'no-trailing-spaces': 'off',
    'no-warning-comments': 'error',
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: 'return',
      },
    ],
    'max-len': [
      'error',
      80,
      {
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
      },
    ],
  },
};
