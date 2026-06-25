import nxPlugin from '@nx/eslint-plugin'
import { defineConfig } from 'eslint/config'
import * as jsoncParser from 'jsonc-eslint-parser'

import { repoConfig } from '@globalfishingwatch/linting'

export default defineConfig([
  // Global ignores
  {
    ignores: [
      '**/node_modules/**',
      // Generated files (e.g. protobuf decoders) are not hand-edited — don't lint them.
      '**/*.gen.js',
      '**/*.gen.ts',
      '**/*.gen.d.ts',
    ],
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
          buildTargets: ['build'],
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
