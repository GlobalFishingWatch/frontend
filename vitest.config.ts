import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['apps/*/vite.config.mts', 'libs/*/vitest.config.mts'],
  },
})
