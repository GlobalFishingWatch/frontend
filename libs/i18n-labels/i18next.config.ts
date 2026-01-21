import { defineConfig } from 'i18next-cli'

export default defineConfig({
  locales: ['source'],
  extract: {
    input: '',
    output: './{{language}}/{{namespace}}.json',
  },
  types: {
    input: ['./source/*.json'],
    output: './i18next.d.ts',
    resourcesFile: './resources.d.ts',
    enableSelector: true, // Enable type-safe key selection
  },
})
