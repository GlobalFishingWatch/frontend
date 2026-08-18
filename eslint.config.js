import { defineConfig } from 'eslint/config'

import {
  cjsRequireConfig,
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
    'libs/ocean-areas/src/data/**',
    'libs/ocean-areas/src/source/**',
    'libs/ui-components/src/miniglobe/ne_110m_land.json',
  ],
}

export default defineConfig([
  globalIgnores,
  packageJsonConfig, // eslint-package-json
  packageJsonDependencyChecksConfig, // @nx/dependency-checks (libs + root)
  repoConfig,
  nodeScriptsConfig,
  cjsRequireConfig,
  routeFilesConfig,
  moduleBoundariesConfig,
])
