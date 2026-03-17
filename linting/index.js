import nxPlugin from '@nx/eslint-plugin'
import { defineConfig } from 'eslint/config'

import { config } from './lib.js'

/**
 * @typedef {import('eslint').Linter.Config} Config
 */
export const repoConfig = {
  ...config,
  plugins: {
    ...config.plugins,
    '@nx': nxPlugin,
  },
  rules: {
    ...config.rules,
  },
}

export default defineConfig([repoConfig])
