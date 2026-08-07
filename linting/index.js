import { defineConfig } from 'eslint/config'

import { config, nodeScriptsConfig, routeFilesConfig } from './lib.js'

/**
 * Shared lint package config. Monorepo-only rules (e.g. @nx/enforce-module-boundaries)
 * live in the workspace root eslint.config.js, not here.
 *
 * @typedef {import('eslint').Linter.Config} Config
 */
export const repoConfig = config

export { nodeScriptsConfig, routeFilesConfig }

export default defineConfig([repoConfig, nodeScriptsConfig, routeFilesConfig])
