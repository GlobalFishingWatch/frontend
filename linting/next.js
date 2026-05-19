import nextPlugin from '@next/eslint-plugin-next'
import { defineConfig } from 'eslint/config'

import { repoConfig } from './index.js'

export const nextConfig = {
  ...repoConfig,
  plugins: {
    ...repoConfig.plugins,
    '@next/next': nextPlugin,
  },
  rules: {
    ...repoConfig.rules,
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs['core-web-vitals'].rules,
  },
}

export default defineConfig([nextConfig])
