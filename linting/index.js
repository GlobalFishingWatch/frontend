import nextPlugin from '@next/eslint-plugin-next'
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
    '@next/next': nextPlugin,
  },
  rules: {
    ...config.rules,
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs['core-web-vitals'].rules,
  },
}

export default defineConfig([repoConfig])
