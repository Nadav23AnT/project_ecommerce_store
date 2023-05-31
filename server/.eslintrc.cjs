module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:promise/recommended',
    'plugin:@cspell/recommended',
    'prettier',
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['build', '.eslintrc.cjs'],
  plugins: ['@typescript-eslint', 'promise', 'import', 'prettier'],
  rules: {
    'prefer-destructuring': 'off',
    'consistent-return': 'off',
    'no-plusplus': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        prefix: ['I'],
        format: ['UPPER_CASE', 'StrictPascalCase'],
      },
    ],
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    '@typescript-eslint/no-namespace': 'off',
    '@cspell/spellchecker': ['error', { checkComments: true, autoFix: true }],
    '@typescript-eslint/no-unused-vars': 'error',
    'prettier/prettier': 'error',
    'no-use-before-define': [
      'error',
      {
        functions: false,
        classes: true,
        variables: true,
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        functions: false,
        classes: true,
        variables: true,
        typedefs: true,
      },
    ],
    'import/no-extraneous-dependencies': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
};
