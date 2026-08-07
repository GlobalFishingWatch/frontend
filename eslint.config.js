import { defineConfig } from 'eslint/config'

import {
  nodeScriptsConfig,
  packageJsonConfig,
  repoConfig,
  routeFilesConfig,
} from '@globalfishingwatch/linting'
import {
  moduleBoundariesConfig,
  packageJsonDependencyChecksConfig,
} from '@globalfishingwatch/linting/nx'

const globalIgnores = {
  ignores: [
    '**/node_modules/**',
    'dist/**',
    '**/dist/**',
    '**/.next/**',
    '**/.output/**',
    '**/.nitro/**',
    '**/.vite/**',
    '**/.rolldown/**',
    '**/coverage/**',
    '**/*.gen.js',
    '**/*.gen.ts',
    '**/*.gen.d.ts',
  ],
}

export default defineConfig([
  globalIgnores,
  packageJsonConfig, // eslint-package-json
  packageJsonDependencyChecksConfig, // @nx/dependency-checks (libs + root)
  repoConfig,
  nodeScriptsConfig,
  routeFilesConfig,
  moduleBoundariesConfig,
])
