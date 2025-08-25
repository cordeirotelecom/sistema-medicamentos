module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Desativar todas as regras problemáticas
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-unsafe-function-type': 'off',
    'react-hooks/exhaustive-deps': 'off',
    '@next/next/no-img-element': 'off',
    'react/no-unescaped-entities': 'off',
    'prefer-const': 'off',
    'no-unused-vars': 'off',
    'no-console': 'off',
    'no-debugger': 'off'
  },
  env: {
    es6: true,
    browser: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
};
