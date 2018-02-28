module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    "eslint:recommended"
  ],
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  root: true,
  rules: {
    "eqeqeq": "error",
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "no-var": "error",
    "prefer-const": "error",
    "quotes": ["error", "double"],
    "semi": ["error", "always"]
  }
};
