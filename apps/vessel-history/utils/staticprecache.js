// ** adapted from next-pwa index.js since it doesn't set up its own entries when additionalManifestEntries is specified
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const globby = require('globby')

const getRevision = (file) => crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex')

// precache files in public folder
function getStaticPrecacheEntries(pwaOptions) {
  // set up properties used in next-pwa code to precache the public folder
  const basePath = pwaOptions.basePath || '/'
  const sw = pwaOptions.sw || 'sw.js'
  const publicExcludes = pwaOptions.publicExcludes || ['!noprecache/**/*']
  const publicPath = pwaOptions.publicPath || 'public'
  console.log(basePath)
  const manifestEntries = globby
    .sync(
      [
        '**/*',
        '!workbox-*.js',
        '!workbox-*.js.map',
        '!worker-*.js',
        '!worker-*.js.map',
        '!fallback-*.js',
        '!fallback-*.js.map',
        `!${sw.replace(/^\/+/, '')}`,
        `!${sw.replace(/^\/+/, '')}.map`,
        ...publicExcludes,
      ],
      {
        cwd: publicPath,
      }
    )
    .map((f) => ({
      url: path.posix.join(basePath, `/${f}`),
      revision: getRevision(`${publicPath}/${f}`),
    }))
  return manifestEntries
}

module.exports = getStaticPrecacheEntries
