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
    ignore: ['**/*.md', '**/*.css', '**/*.css.module', '**/*.scss', '**/*.sass', '**/*.less'],
    output: 'public/locales/{{language}}/{{namespace}}.json',
    defaultNS: 'translations',
    sort: true,
    keySeparator: '.',
    nsSeparator: ':',
    contextSeparator: '_',
    functions: ['t', '*.t', 'i18next.t'],
    transComponents: ['Trans'],
    preservePatterns: [
      'datasetUpload.errors.*',
      'feedback.features.*',
      'feedback.roles.*',
      'layer.areas.*',
      'time.*',
      'user.badges.*',
      'vessel.gearTypes.*',
      'vessel.vesselTypes.*',
      'vesselGroupReport.insights.*',
      'workspace.categories.*',
      'workspace.siteDescription.*',
      // Namespaces, but not working yet... workaround discarding changes into the package.json file
      'data-terminology:*',
      'layer-library:*',
      'workspaces:*',
    ],
    generateBasePluralForms: false,
    disablePlurals: false,
  },

  // TypeScript type generation
  types: {
    input: ['public/locales/source/*.json'],
    output: './features/i18n/i18next.d.ts',
    resourcesFile: './features/i18n/i18n.types.d.ts',
    enableSelector: true, // Enable type-safe key selection
  },
})
