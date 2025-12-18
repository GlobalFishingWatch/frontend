import { defineConfig } from 'i18next-cli'

const foldersToExtract = [
  'data',
  'features',
  'hooks',
  'pages',
  'routes',
  'server',
  'types',
  'utils',
]

export default defineConfig({
  locales: ['source'],
  extract: {
    input: foldersToExtract.map((folder) => `./${folder}/**/*.{js,jsx,ts,tsx}`),
    ignore: [
      '**/*.md',
      '**/*.css',
      '**/*.css.module',
      '**/*.test.*',
      '**/*.spec.*',
      '**/test-results/**',
      '**/__traces__/**',
    ],
    output: 'public/locales/{{language}}/{{namespace}}.json',
    defaultNS: 'translations',
    sort: true,
    keySeparator: '.',
    nsSeparator: ':',
    contextSeparator: '_',
    preservePatterns: [
      // API dynamic properties
      'datasetUpload.errors.*',
      'vesselGroupReport.insights.*',
      // Namespaces controlled by hand
      'data-terminology:*',
      'layer-library:*',
      'workspaces:*',
    ],
    generateBasePluralForms: false,
    disablePlurals: false,
    primaryLanguage: 'en',
  },

  // TypeScript type generation
  types: {
    input: ['public/locales/source/*.json'],
    output: './features/i18n/i18next.d.ts',
    resourcesFile: './features/i18n/i18n.types.d.ts',
    enableSelector: true, // Enable type-safe key selection
  },
})
