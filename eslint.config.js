import nxPlugin from '@nx/eslint-plugin'
import { defineConfig } from 'eslint/config'
import * as jsoncParser from 'jsonc-eslint-parser'

import { nodeScriptsConfig, repoConfig, routeFilesConfig } from '@globalfishingwatch/linting'

export default defineConfig([
  // Global ignores
  {
    ignores: [
      '**/node_modules/**',
      'dist/**',
      '**/dist/**',
      // Build output. Without these eslint walks generated bundles — apps/api-portal/.next
      // alone was 2560 files / ~105k warnings.
      '**/.next/**',
      '**/.output/**',
      '**/.nitro/**',
      '**/.vite/**',
      '**/.rolldown/**',
      '**/coverage/**',
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
  nodeScriptsConfig,
  routeFilesConfig,
  // Monorepo-only: apps must not import other apps; libs must not import apps.
  // Tags already exist on every project (app / lib / e2e). Kept here (not in
  // @globalfishingwatch/linting) so the published lint package stays usable outside this repo.
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    plugins: {
      '@nx': nxPlugin,
    },
    rules: {
      '@nx/enforce-module-boundaries': [
        'warn',
        {
          enforceBuildableLibDependency: false,
          // '#*' are Node subpath imports declared in libs/*/package.json "imports".
          // The rule reads them as cross-project imports; they are intra-project by design.
          allow: ['#*', '#*/**'],
          depConstraints: [
            { sourceTag: 'app', onlyDependOnLibsWithTags: ['lib'] },
            { sourceTag: 'lib', onlyDependOnLibsWithTags: ['lib'] },
            { sourceTag: 'e2e', onlyDependOnLibsWithTags: ['app', 'lib'] },
          ],
        },
      ],
    },
  },
])
