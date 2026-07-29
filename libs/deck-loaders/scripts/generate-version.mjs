import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'))

const versionFileContent = `// This file is auto-generated. Do not edit manually.
// Run "nx generate-version deck-loaders" to regenerate.
export const VERSION = '${packageJson.version}'
`

writeFileSync(join(__dirname, '../src/version.ts'), versionFileContent)
 
console.log(`Generated version.ts with version ${packageJson.version}`)
