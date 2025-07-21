import nextPlugin from '@next/eslint-plugin-next'
import nxPlugin from '@nx/eslint-plugin'

import tseslint from 'typescript-eslint'

import { config } from './lib.js'

/**
 * @typedef {import('typescript-eslint').ConfigWithExtends} ConfigWithExtends
 */
const repoConfig = {
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
    '@nx/dependency-checks': [
      'error',
      {
        ignoredFiles: [
          '{projectRoot}/vite.config.{js,ts,mjs,mts}',
          '{projectRoot}/rollup.config.{js,ts,mjs,mts}',
        ],
      },
    ],
  },
}

export default tseslint.config(repoConfig)
