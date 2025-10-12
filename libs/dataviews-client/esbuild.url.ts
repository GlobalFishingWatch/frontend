const { build } = require('esbuild')
const path = require('path')
const fs = require('fs')

async function buildBundle() {
  await build({
    entryPoints: ['libs/dataviews-client/src/url-workspace/url-workspace.ts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile: 'dist/libs/url-workspace/url-workspace.js',
    external: [], // Don't externalize anything - bundle everything
    packages: 'bundle', // Bundle all packages
    splitting: false,
    sourcemap: false,
    minify: false,
    target: 'es2022',
    tsconfig: 'libs/dataviews-client/tsconfig.url.json',
    resolveExtensions: ['.ts', '.js'],
    logLevel: 'info',
  })

  // Copy package.json to output directory
  const packageJsonPath = 'libs/dataviews-client/src/url-workspace/package.json'
  const outputDir = 'dist/libs/url-workspace'

  if (fs.existsSync(packageJsonPath)) {
    fs.copyFileSync(packageJsonPath, path.join(outputDir, 'package.json'))
    console.log('Copied package.json to output directory')
  } else {
    console.log('package.json not found at:', packageJsonPath)
  }
}

buildBundle().catch(console.error)
