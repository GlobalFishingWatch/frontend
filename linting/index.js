import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import nxPlugin from '@nx/eslint-plugin'
import next from '@next/eslint-plugin-next'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import prettierConfig from 'eslint-config-prettier'

// import { includeIgnoreFile } from '@eslint/compat'
// import path from 'node:path'
// import { fileURLToPath } from 'node:url'
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)
// const gitignorePath = path.resolve(__dirname, '.gitignore')

export default tseslint.config({
  files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.mjs'],
  plugins: {
    '@nx': nxPlugin,
    import: importPlugin,
    react,
    '@next': next,
    'react-hooks': reactHooksPlugin,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  extends: [
    eslint.configs.recommended,
    tseslint.configs.recommended,
    jsxA11y.flatConfigs.recommended,
    prettierConfig,
    // includeIgnoreFile(gitignorePath),
  ],
  ignores: [
    'node_modules',
    'dist',
    '**/dist/**',
    'public',
    '**/public/**',
    '.next',
    '**/.next/**',
    'exported',
    '**/exported/**',
  ],
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  rules: {
    '@typescript-eslint/array-type': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    'import/default': 0,
    'import/no-unresolved': 0,
    'import/no-named-as-default': 0,
    'import/named': 0,
    'import/namespace': 0,
    'import/order': [
      1,
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'never',
        pathGroups: [
          {
            pattern: '@globalfishingwatch/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern:
              '{features,store,routes,common,components,redux-modules,types,assets,pages,data,hooks,utils}',
            group: 'internal',
          },
          {
            pattern:
              '{features,store,routes,common,components,redux-modules,types,assets,pages,data,hooks,utils}/**',
            group: 'internal',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],
    // 'react/jsx-fragments': ['error', 'element'],
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-redeclare': 0,
    // note you must disable the base rule as it can report incorrect errors
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md#i-am-using-a-rule-from-eslint-core-and-it-doesnt-work-correctly-with-typescript-code
    'prefer-const': 1,
    'no-unused-vars': 0,
    'no-use-before-define': 0,
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-use-before-define': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/no-empty-function': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'jsx-a11y/mouse-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',
    '@nx/dependency-checks': [
      'error',
      {
        ignoredFiles: [
          '{projectRoot}/vite.config.{js,ts,mjs,mts}',
          '{projectRoot}/rollup.config.{js,ts,mjs,mts}',
        ],
      },
    ],
  },
})
