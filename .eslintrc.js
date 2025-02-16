module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2022: true
  },
  extends: ['eslint:recommended', 'plugin:vue/recommended'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: 'module'
  },
  rules: {
    'prettier/prettier': 'error'
  }
};
