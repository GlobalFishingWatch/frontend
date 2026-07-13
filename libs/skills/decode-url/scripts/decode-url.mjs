#!/usr/bin/env node
import './register-gfw-resolver.mjs'

const url = process.argv[2]
if (!url) {
  console.error(`Usage: node decode-url.mjs '<map url or path>'`)
  process.exit(1)
}

const { decodeMapUrl } = await import('@globalfishingwatch/skills')

try {
  const result = decodeMapUrl(url)
  console.log(JSON.stringify(result, null, 2))
} catch (error) {
  console.error(error.message)
  process.exit(1)
}
