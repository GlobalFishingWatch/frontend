const { build } = require('esbuild')
const path = require('path')
const fs = require('fs')

async function buildBundle() {
  // Build the UDF library bundle
  await build({
    entryPoints: ['libs/dataviews-client/src/url-workspace/url-workspace.ts'],
    bundle: true,
    platform: 'node',
    format: 'iife', // IIFE format for BigQuery UDF compatibility
    globalName: 'UrlWorkspace', // Global namespace for BigQuery
    outfile: 'dist/libs/url-workspace/url-workspace.js',
    external: ['util', 'buffer', 'process', 'path', 'fs', 'http', 'url'], // External Node.js built-ins
    packages: 'bundle', // Bundle all packages
    splitting: false,
    sourcemap: false,
    minify: true, // Minify for BigQuery
    target: 'es2017',
    tsconfig: 'libs/dataviews-client/tsconfig.url.json',
    resolveExtensions: ['.ts', '.js'],
    logLevel: 'info',
    banner: {
      js: `// Shim for require in browser/BigQuery environment
        var require = function(module) {
          if (module === 'util') {
            var inspectFn = function() { return String(arguments[0]); };
            inspectFn.custom = typeof Symbol !== "undefined" ? Symbol.for('nodejs.util.inspect.custom') : 'inspect.custom';
            return { inspect: inspectFn };
          }
          return {};
        };
        var module = { exports: {} };
        var exports = module.exports;
      `,
    },
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  })

  console.log('✅ Built BigQuery UDF library bundle successfully!')
  console.log('📦 Output: dist/libs/url-workspace/url-workspace.js')
  console.log('')
  console.log('Usage in BigQuery UDF:')
  console.log('1. Upload the bundle to Cloud Storage or use inline')
  console.log('2. Reference in your UDF: @url-workspace.js')
  console.log(`3. Use it like: \n
    CREATE TEMP FUNCTION parseWorkspace(url STRING)
    RETURNS JSON
    LANGUAGE js
      OPTIONS (
        library=['gs://raul-scratch-60ttl/url-workspace.js'])
    AS r"""
      // Access the library via UrlWorkspace global
      return JSON.stringify(UrlWorkspace.parseWorkspace(url));
    """;

    SELECT val, parseWorkspace(val) as result
    FROM UNNEST(['longitude=26&latitude=19&zoom=1.49']) as val;
    `)
}

buildBundle().catch(console.error)
