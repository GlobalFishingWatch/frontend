// import { includeIgnoreFile } from '@eslint/compat'
import eslint from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

import tseslint from 'typescript-eslint'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)
// const gitignorePath = path.resolve(__dirname, '.gitignore')

/**
 * @typedef {import('typescript-eslint').ConfigWithExtends} ConfigWithExtends
 */
export const config = {
  files: ['**/*.{js,ts,jsx,tsx}', '**/*.mjs'],
  plugins: {
    import: importPlugin,
    'simple-import-sort': simpleImportSort,
    react: reactPlugin,
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
    jsxA11yPlugin.flatConfigs.recommended,
    prettierConfig,
    // includeIgnoreFile(gitignorePath),
  ],
  ignores: [
    'node_modules',
    'dist',
    'public',
    'exported',
    '**/dist/**/*',
    '**/public/**/*',
    '**/.next/**/*',
    '**/exported/**/*',
  ],
  languageOptions: {
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  rules: {
    ...reactPlugin.configs['jsx-runtime'].rules,
    ...reactHooksPlugin.configs.recommended.rules,
    'import/default': 0,
    'import/no-unresolved': 0,
    'import/no-named-as-default': 0,
    'import/named': 0,
    'import/namespace': 0,
    'import/order': 0,
    'import/first': 1,
    'import/newline-after-import': 1,
    'import/no-duplicates': 1,
    'simple-import-sort/imports': [
      1,
      {
        groups: [
          // Node.js builtins. You could also generate this regex if you use a `.js` config.
          // For example: `^(${require("module").builtinModules.join("|")})(/|$)`
          // Note that if you use the `node:` prefix for Node.js builtins,
          // you can avoid this complexity: You can simply use "^node:".
          ['^(node|node:)(/.*|$)'],
          [
            '^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)',
          ],
          // Packages. `react` related packages come first.
          ['^react', '^@?\\w'],
          // Internal packages.
          ['^(@|@globalfishingwatch)(/.*|$)'],
          // Internal paths.
          [
            '^(features|store|routes|common|components|redux-modules|types|assets|pages|data|hooks|utils)(/.*(?<!\\.css)$)?',
          ],
          // Side effect imports.
          ['^\\u0000'],
          // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          // Style imports.
          ['^.+\\.s?css$'],
        ],
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
    '@typescript-eslint/array-type': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-require-imports': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-use-before-define': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/ban-ts-comment': 'warn',
    'jsx-a11y/no-autofocus': 1,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'jsx-a11y/mouse-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',
  },
}

export default tseslint.config(config)
