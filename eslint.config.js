import nxPlugin from '@nx/eslint-plugin'
import { defineConfig } from 'eslint/config'
import jsoncParser from 'jsonc-eslint-parser'

import { repoConfig } from '@globalfishingwatch/linting'

export default defineConfig([
  // Global ignores
  {
    ignores: ['.next/**', '**/node_modules/**'],
  },
  // Configuration for package.json files (dependency checks)
  {
    files: ['**/package.json'],
    languageOptions: {
      parser: jsoncParser,
    },
    plugins: {
      '@nx': nxPlugin,
    },
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          buildTargets: ['dist', 'build'],
          ignoredFiles: ['{projectRoot}/vite.config.{js,ts,mjs,mts}'],
          checkMissingDependencies: true,
          checkObsoleteDependencies: true,
          checkVersionMismatches: true,
        },
      ],
    },
  },
  // GFW shared linting config
  repoConfig,
])
