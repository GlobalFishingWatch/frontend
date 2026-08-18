import { defineConfig } from 'eslint/config'

import {
  cjsRequireConfig,
  config,
  nodeScriptsConfig,
  packageJsonConfig,
  routeFilesConfig,
} from './lib.js'

/**
 * Shared lint package config. Nx monorepo rules live in `./nx` and are opt-in.
 *
 * @typedef {import('eslint').Linter.Config} Config
 */
export const repoConfig = config

export { cjsRequireConfig, nodeScriptsConfig, packageJsonConfig, routeFilesConfig }

export default defineConfig([repoConfig, nodeScriptsConfig, cjsRequireConfig, routeFilesConfig])
