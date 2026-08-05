// Rolls each entry point's declarations into ONE self-contained .d.ts.
//
// Why bundle instead of plain `tsc --declaration`: the published JS bundles inline every
// dependency, so the package must declare no runtime deps. A plain tsc emit would leave
// `import type { BaseUrlWorkspace } from '@globalfishingwatch/dataviews-client'` in the output,
// forcing consumers to install a package the bundle does not need. `inlinedLibraries` copies
// those declarations into our own .d.ts instead, so src/ keeps using the real library types
// while the published surface stays dependency-free.
const path = require('node:path')

const out = (file) => path.join(__dirname, 'dist', file)
const entry = (file) => path.join(__dirname, 'src', file)

/** @type {import('dts-bundle-generator/config-schema').BundlerConfig} */
module.exports = {
  compilationOptions: {
    preferredConfigPath: path.join(__dirname, 'tsconfig.types.json'),
  },
  entries: [
    { filePath: entry('index.ts'), outFile: out('index.d.ts') },
    { filePath: entry('encode-url/index.ts'), outFile: out('encode-url/index.d.ts') },
    { filePath: entry('decode-url/index.ts'), outFile: out('decode-url/index.d.ts') },
  ].map((e) => ({
    ...e,
    noCheck: false,
    libraries: {
      inlinedLibraries: ['@globalfishingwatch/dataviews-client'],
    },
    output: {
      inlineDeclareGlobals: false,
      sortNodes: false,
      noBanner: true,
    },
  })),
}
