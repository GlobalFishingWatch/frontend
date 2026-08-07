import nxPlugin from '@nx/eslint-plugin'
import { toCompatPlugin } from 'eslint-json-compat-utils'

const nxJsonPlugin = toCompatPlugin(nxPlugin)

export const dependencyChecksOptions = {
  buildTargets: ['build'],
  ignoredFiles: [
    '{projectRoot}/vite.config.{js,ts,mjs,mts}',
    '{projectRoot}/vitest.config.{js,ts,mjs,mts}',
    '{projectRoot}/esbuild.*.ts',
    '{projectRoot}/**/*.{spec,test}.{ts,tsx}',
    '{projectRoot}/scripts/**',
  ],
  // Generated protobuf decoders (`*.gen.js`) are gitignored, so the import is invisible
  ignoredDependencies: ['protobufjs'],
  checkMissingDependencies: true,
  checkObsoleteDependencies: true,
  checkVersionMismatches: true,
}

export const packageJsonDependencyChecksConfig = {
  files: ['**/package.json'],
  plugins: {
    '@nx': nxJsonPlugin,
  },
  rules: {
    '@nx/dependency-checks': ['error', dependencyChecksOptions],
  },
}

/** Apps declare only workspace: deps; npm packages resolve from root. */
export const appPackageJsonConfig = {
  files: ['package.json'],
  plugins: {
    '@nx': nxJsonPlugin,
  },
  rules: {
    '@nx/dependency-checks': [
      'error',
      {
        ...dependencyChecksOptions,
        checkMissingDependencies: false,
      },
    ],
  },
}

export const moduleBoundariesConfig = {
  files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
  plugins: {
    '@nx': nxPlugin,
  },
  rules: {
    '@nx/enforce-module-boundaries': [
      'warn',
      {
        enforceBuildableLibDependency: false,
        // '#*' are Node subpath imports declared in libs/*/package.json "imports".
        // The rule reads them as cross-project imports; they are intra-project by design.
        allow: ['#*', '#*/**'],
        depConstraints: [
          { sourceTag: 'app', onlyDependOnLibsWithTags: ['lib'] },
          { sourceTag: 'lib', onlyDependOnLibsWithTags: ['lib'] },
          { sourceTag: 'e2e', onlyDependOnLibsWithTags: ['app', 'lib'] },
        ],
      },
    ],
  },
}
