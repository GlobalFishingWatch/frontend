module.exports = {
  ...require('@globalfishingwatch/linting/typescript'),
  // TODO couldn't disable prettier so I copied & pasted this from the linting package
  extends: [
    'plugin:@typescript-eslint/recommended',
    'react-app',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
}
