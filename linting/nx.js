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
    // playwright/sharp/dataviews-client are devDependencies of ocean-areas: a local screenshot
    // script, not part of the published surface. Named exactly so the sibling data-prep scripts
    // (and their dotenv/turf imports) still count towards the manifest.
    '{projectRoot}/src/scripts/screenshots.ts',
  ],
  // - protobufjs / long: only imported from the generated `*.gen.js` / `*.gen.d.ts` decoders,
  // - @platform/config: it *is* an Nx project (inferred from its package.json) but without a build target
  ignoredDependencies: ['protobufjs', 'long', '@platform/config'],
  checkMissingDependencies: true,
  checkObsoleteDependencies: true,
  checkVersionMismatches: true,
}

export const packageJsonDependencyChecksConfig = {
  files: ['**/package.json'],
  // url-workspace and skills are self-contained bundles; their workspace
  // packages must stay in devDependencies so `--fix` cannot promote them.
  ignores: ['**/url-workspace/package.json', '**/libs/skills/package.json'],
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
