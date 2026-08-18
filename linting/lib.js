// import { includeIgnoreFile } from '@eslint/compat'
import eslint from '@eslint/js'
import { defineConfig } from 'eslint/config'
import prettierConfig from 'eslint-config-prettier'
import packageJson from 'eslint-package-json'
import importPlugin from 'eslint-plugin-import'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

import tseslint from 'typescript-eslint'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)
// const gitignorePath = path.resolve(__dirname, '.gitignore')

/**
 * @typedef {import('typescript-eslint').ConfigWithExtends} ConfigWithExtends
 */
export const config = {
  files: ['**/*.{js,cjs,mjs,ts,cts,mts,jsx,tsx}'],
  plugins: {
    import: importPlugin,
    'simple-import-sort': simpleImportSort,
    react: reactPlugin,
    'react-hooks': reactHooksPlugin,
    'react-refresh': reactRefreshPlugin,
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
    'react-hooks/preserve-manual-memoization': 'warn',
    'react-hooks/set-state-in-effect': 'warn',
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
          ['^(@|@globalfishingwatch|@platform/config)(/.*|$)'],
          // Internal paths.
          [
            '^#', //`#` is a package.json `imports` subpath (package-internal alias).
            '^(features|store|routes|router|reducers|server|server-functions|common|components|redux-modules|types|assets|pages|data|hooks|utils)(/.*(?<!\\.css)$)?',
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
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-use-before-define': [
      'warn',
      {
        // Function declarations are hoisted; mutual recursion is common and safe
        functions: false,
        classes: false,
        typedefs: false,
        ignoreTypeReferences: true,
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-empty-object-type': 1,
    '@typescript-eslint/ban-ts-comment': 'warn',
    'jsx-a11y/no-autofocus': 1,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'jsx-a11y/mouse-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',
    'react-refresh/only-export-components': [
      'error',
      { allowConstantExport: true, allowExportNames: ['Route'] },
    ],
  },
}

// TanStack Router route files only export `Route` by convention; intentionally not a Fast Refresh boundary
export const routeFilesConfig = {
  files: ['**/routes/**/*.tsx'],
  rules: {
    'react-refresh/only-export-components': 'off',
  },
}

// Node-context config/script files (not app source) need Node globals
export const nodeScriptsConfig = {
  files: ['**/*.config.{js,cjs,mjs}', '**/scripts/**/*.{js,cjs,mjs}', '**/legacy.js'],
  languageOptions: {
    globals: {
      process: 'readonly',
      module: 'readonly',
      require: 'readonly',
      __dirname: 'readonly',
      __filename: 'readonly',
      console: 'readonly',
      URL: 'readonly',
      URLSearchParams: 'readonly',
    },
  },
}

// Explicit CJS only — keep pushing .js/.mjs toward ESM imports
export const cjsRequireConfig = {
  files: ['**/*.cjs'],
  rules: {
    '@typescript-eslint/no-require-imports': 'off',
  },
}

export const packageJsonConfig = {
  files: ['**/package.json'],
  plugins: {
    'package-json': packageJson,
  },
  extends: ['package-json/recommended'],
  rules: {
    'package-json/dependency-version-range': ['error', { range: 'consistent' }],
    // pnpm rewrites workspace: on publish; source manifests intentionally use it
    'package-json/no-workspace-protocol-in-published-package': 'off',
    // root preinstall (only-allow pnpm) + postinstall (husky)
    'package-json/no-install-scripts': 'off',
    // workspace packages live under apps/*/libs/*; their exports/imports are real package roots
    'package-json/no-nested-exports': 'off',
    // preserve `development` → `types` → `default` order for Vite HMR
    'package-json/require-types-in-exports': 'off',
    // libs keep main/types alongside exports for tooling that does not read exports
    'package-json/prefer-exports': 'off',
    // engines/keywords/sideEffects are not standardized across this monorepo yet
    'package-json/require-engines': 'off',
    'package-json/require-fields': 'off',
    'package-json/prefer-side-effects-field': 'off',
    // `files` allowlists and `type` vary; not enforced workspace-wide yet
    'package-json/prefer-files-field': 'off',
    'package-json/prefer-type-module': 'off',
    // empty description strings and ambient @types/* without a runtime sibling are common here
    'package-json/no-empty-fields': 'off',
    'package-json/no-orphan-types': 'off',
    // script names like `prerender` are not always paired with a `render` script
    'package-json/no-orphan-script-hooks': 'off',
  },
}

export default defineConfig([config, nodeScriptsConfig, cjsRequireConfig])
