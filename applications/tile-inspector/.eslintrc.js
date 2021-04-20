const config = require('@globalfishingwatch/linting/typescript')

module.exports = {
  ...config,
  // TODO couldn't disable prettier so I copied & pasted this from the linting package
  extends: [
    'plugin:@typescript-eslint/recommended',
    'react-app',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
}
