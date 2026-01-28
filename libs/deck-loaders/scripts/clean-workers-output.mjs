/**
 * Cleans up the workers output from dist/workers/[type]/workers/* to dist/workers/*
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const base = path.join(__dirname, '..', 'dist', 'workers')

if (!fs.existsSync(base)) {
  process.exit(0)
}

const dirs = fs.readdirSync(base).filter((n) => {
  const p = path.join(base, n)
  return fs.statSync(p).isDirectory()
})

for (const d of dirs) {
  const workersDir = path.join(base, d, 'workers')
  if (fs.existsSync(workersDir)) {
    for (const f of fs.readdirSync(workersDir)) {
      fs.renameSync(path.join(workersDir, f), path.join(base, f))
    }
  }
}

for (const d of dirs) {
  fs.rmSync(path.join(base, d), { recursive: true })
}

// Remove build artifacts we don't want in the final output
const toRemove = ['libs', 'package.json']
for (const name of toRemove) {
  const p = path.join(base, name)
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true })
  }
}
