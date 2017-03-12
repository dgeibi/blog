module.exports = {
  "extends": "airbnb-base",
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "node": true,
    "amd": true
  },
  "parserOptions": {
    "sourceType": "module"
  },
  "rules": {
    "no-extra-semi": 1,
    "semi": ["error", "never"],
    "no-use-before-define": [
      "error",
      {
        "functions": false,
      }
    ],
    "comma-dangle": [
      "error",
      {
        "arrays": "always",
        "objects": "always",
        "imports": "never",
        "exports": "never",
        "functions": "never",
      }
    ]
  },
  "globals": {
    "hexo": true
  }
}
