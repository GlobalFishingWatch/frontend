import fs from 'node:fs'
import path from 'node:path'

const [projectRootArg, outputPathArg] = process.argv.slice(2)

if (!projectRootArg || !outputPathArg) {
  console.error(
    'Usage: node tools/scripts/generate-dist-package.mjs <projectRoot> <outputPath>'
  )
  process.exit(1)
}

const workspaceRoot = process.cwd()
const projectRoot = path.resolve(workspaceRoot, projectRootArg)
const outputPath = path.resolve(workspaceRoot, outputPathArg)
const packageJsonPath = path.join(projectRoot, 'package.json')

if (!fs.existsSync(packageJsonPath)) {
  console.error(`Missing package.json at ${packageJsonPath}`)
  process.exit(1)
}

const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const isModule = pkg.type === 'module' || Boolean(pkg.module)
const distMain = './index.js'
const distTypes = './index.d.ts'

const stripSrcPrefix = (target) =>
  typeof target === 'string' && target.startsWith('./src/')
    ? `./${target.slice('./src/'.length)}`
    : target

const toDistTypes = (target) => {
  const normalized = stripSrcPrefix(target)
  if (typeof normalized !== 'string') return normalized
  if (normalized.endsWith('.d.ts')) return normalized
  if (normalized.endsWith('.ts')) return `${normalized.slice(0, -3)}.d.ts`
  if (normalized.endsWith('.tsx')) return `${normalized.slice(0, -4)}.d.ts`
  return normalized
}

const toDistCode = (target) => {
  const normalized = stripSrcPrefix(target)
  if (typeof normalized !== 'string') return normalized
  if (normalized.endsWith('.ts')) return `${normalized.slice(0, -3)}.js`
  if (normalized.endsWith('.tsx')) return `${normalized.slice(0, -4)}.js`
  return normalized
}

const rewriteExportEntry = (entry) => {
  if (typeof entry === 'string') {
    return toDistCode(entry)
  }
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    return entry
  }
  const next = {}
  for (const [condition, value] of Object.entries(entry)) {
    if (typeof value === 'string') {
      const isTypes = condition === 'types' || condition === 'typings'
      next[condition] = isTypes ? toDistTypes(value) : toDistCode(value)
    } else if (value && typeof value === 'object') {
      next[condition] = rewriteExportEntry(value)
    } else {
      next[condition] = value
    }
  }
  return next
}

const rewriteExportsMap = (exportsMap) => {
  if (!exportsMap || typeof exportsMap === 'string') {
    return { '.': exportsMap ? { default: toDistCode(exportsMap) } : {} }
  }
  if (typeof exportsMap !== 'object') {
    return { '.': {} }
  }
  const next = {}
  for (const [subpath, entry] of Object.entries(exportsMap)) {
    next[subpath] = rewriteExportEntry(entry)
  }
  return next
}

pkg.main = distMain
pkg.types = distTypes

if (pkg.typings) {
  pkg.typings = distTypes
}

if (pkg.module || isModule) {
  pkg.module = distMain
}

pkg.exports = rewriteExportsMap(pkg.exports)

if (!pkg.exports['.'] || typeof pkg.exports['.'] !== 'object') {
  pkg.exports['.'] = {}
}

if (isModule) {
  pkg.exports['.'].import = distMain
  pkg.exports['.'].default = distMain
} else {
  pkg.exports['.'].require = distMain
  pkg.exports['.'].default = distMain
}

pkg.exports['.'].types = distTypes

fs.mkdirSync(outputPath, { recursive: true })
fs.writeFileSync(
  path.join(outputPath, 'package.json'),
  JSON.stringify(pkg, null, 2) + '\n'
)
