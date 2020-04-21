module.exports = {
  plugins: ['prettier', '@typescript-eslint'],
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  extends: ['airbnb-typescript/base', 'plugin:prettier/recommended', 'prettier/@typescript-eslint'],
  rules: {
    'nuxt/no-cjs-in-config': 'off',
    'no-unused-vars': 'off',
    'no-plusplus': 'off',
    'no-await-in-loop': 'off',
    'no-restricted-syntax': 'off',
    'no-continue': 'off',
    'default-case': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-implied-eval': 'off',
    '@typescript-eslint/no-throw-literal': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off'
  }
}
