module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'arrow-parens': [2, 'always'],
    curly: 2,
    'linebreak-style': ['error', 'unix'],
    'no-unused-vars': [2, {args: 'all', argsIgnorePattern: '^__', varsIgnorePattern: '^__'}],
    'no-use-before-define': 0,
    'object-curly-spacing': [2, 'never'],
    quotes: ['error', 'single'],
    'react/jsx-props-no-spreading': 0,
    'arrow-body-style': 0,
  },
};
