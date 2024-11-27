# @globalfishingwatch/linting

[![npm version](https://badge.fury.io/js/%40satellitestudio%2Feslint-config.svg)](https://badge.fury.io/js/%40satellitestudio%2Feslint-config)
[![GitHub license](https://img.shields.io/github/license/satellitestudio/eslint-config.svg)](https://github.com/satellitestudio/eslint-config/blob/master/LICENCE)

Monorepo eslint config with some custom rules and prettier integration

## Installation

```sh
npx install-peerdeps --dev @globalfishingwatch/linting

# or
yarn add @globalfishingwatch/linting -D --peer
```

## Usage

### Eslint

Flat config >= v9

to your `eslint.config.mjs`:

```js
import gfwConfig from '@globalfishingwatch/linting'

export default gfwConfig

```

Legacy usage < v9

1. Add to your `.eslintrc`:

```json
{
  "extends": "@globalfishingwatch/linting/legacy"
}
```

2. Add the config to either your `package.json`:

#### JS

```json
{
  "eslintConfig": {
    "extends": "@globalfishingwatch/linting"
  }
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
