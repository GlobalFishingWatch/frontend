#!/usr/bin/env node
import './register-gfw-resolver.mjs'

const readStdin = async () => {
  let data = ''
  for await (const chunk of process.stdin) data += chunk
  return data
}

const input = process.argv[2] && process.argv[2] !== '-' ? process.argv[2] : await readStdin()
if (!input?.trim()) {
  console.error(
    `Usage: node encode-url.mjs '{"route":{"type":"workspace"},"state":{...}}' (or pipe JSON via stdin)`
  )
  process.exit(1)
}

const { encodeMapUrl } = await import('@globalfishingwatch/skills/encode-url')

try {
  const result = encodeMapUrl(JSON.parse(input))
  console.log(JSON.stringify(result, null, 2))
} catch (error) {
  console.error(error.message)
  process.exit(1)
}
