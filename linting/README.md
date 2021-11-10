# @globalfishingwatch/linting

[![npm version](https://badge.fury.io/js/%40satellitestudio%2Feslint-config.svg)](https://badge.fury.io/js/%40satellitestudio%2Feslint-config)
[![GitHub license](https://img.shields.io/github/license/satellitestudio/eslint-config.svg)](https://github.com/satellitestudio/eslint-config/blob/master/LICENCE)

Eslint config based on [eslint-config-react-app](https://www.npmjs.com/package/eslint-config-react-app) with some custom rules and prettier integration

## Installation

```sh
npx install-peerdeps --dev @globalfishingwatch/linting

# or
yarn add @globalfishingwatch/linting -D --peer
```

## Usage

### Eslint

Now add the config to either your `package.json`:

#### JS

```json
{
  "eslintConfig": {
    "extends": "@globalfishingwatch/linting"
  }
}
```

to your `.eslintrc`:

```json
{
  "extends": "@globalfishingwatch/linting"
}
```

#### Typescript

```json
{
  "eslintConfig": {
    "extends": "@globalfishingwatch/linting/typescript"
  }
}
```

to your `.eslintrc`:

```json
{
  "extends": "@globalfishingwatch/linting/typescript"
}
```

### Prettier

to your `.prettierrc`:

```js
module.exports = require('@globalfishingwatch/linting/prettier')
```

## Recommendations

### VS Code

Install the ESLint and Prettier VSCode extensions:

```js
ext install esbenp.prettier-vscode dbaeumer.vscode-eslint
```

Copy this to `settings.json`

```json
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": false, // avoids running the format twice,
  "eslint.autoFixOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
```

## LICENCE

[MIT](LICENCE)
