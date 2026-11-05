#!/usr/bin/env node
// Builds the weekly test coverage message for Slack and prints it to stdout.
//
// None of our suites measure code coverage (smoke tests are black-box Playwright runs
// against a built image, API tests are black-box HTTP calls), so "coverage" here means
// what each suite declares: how many tests exist, how they are tagged and, for the API
// tests, how many items of the TEST_COVERAGE.md checklist are ticked.
//
// To add a suite: write a collector returning { title, lines } and add it to `collectors`.
//
// Usage: weekly-test-report.mjs --smoke-json <playwright --list json> --api-dir <api-tests checkout>

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'

const { values: args } = parseArgs({
  options: {
    'smoke-json': { type: 'string' },
    'api-dir': { type: 'string' },
  },
})

const pct = (part, total) => (total ? `${Math.round((part / total) * 100)}%` : 'n/a')

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) yield* walk(path)
    else yield path
  }
}

// Smoke tests: Playwright specs listed with `playwright test --list --reporter=json`.
function collectSmoke(jsonPath) {
  const report = JSON.parse(readFileSync(jsonPath, 'utf8'))
  const specs = new Map()
  const visit = (suite) => {
    for (const spec of suite.specs ?? []) {
      // The same spec is listed once per browser project, count it once
      specs.set(`${spec.file}:${spec.line}`, spec)
    }
    for (const child of suite.suites ?? []) visit(child)
  }
  report.suites.forEach(visit)

  const byTag = {}
  let untagged = 0
  for (const spec of specs.values()) {
    if (!spec.tags?.length) untagged++
    for (const tag of spec.tags ?? []) byTag[tag] = (byTag[tag] ?? 0) + 1
  }
  const tagged = ['smoke', 'extended', 'regression']
    .filter((tag) => byTag[tag])
    .map((tag) => `${byTag[tag]} @${tag}`)
  const files = new Set([...specs.values()].map((spec) => spec.file)).size

  return {
    title: 'Smoke tests (Playwright, platform-e2e)',
    lines: [
      `${specs.size} tests in ${files} files`,
      `By tag: ${tagged.join(', ') || 'none'}${untagged ? `, ${untagged} untagged` : ''}`,
    ],
  }
}

// API tests: declared jest tests plus the ticked items of TEST_COVERAGE.md.
function collectApi(dir) {
  const testsDir = join(dir, 'src', 'tests')
  let files = 0
  let tests = 0
  let skipped = 0
  for (const path of walk(testsDir)) {
    if (!path.endsWith('.test.ts')) continue
    files++
    const source = readFileSync(path, 'utf8')
    tests += (source.match(/^\s*(?:it|test)\s*\(/gm) ?? []).length
    skipped += (source.match(/^\s*(?:it|test|describe)\.skip\s*\(|^\s*xit\s*\(/gm) ?? []).length
  }

  const domains = []
  let domain = null
  for (const line of readFileSync(join(dir, 'TEST_COVERAGE.md'), 'utf8').split('\n')) {
    const heading = line.match(/^## (.+)/)
    if (heading) {
      domain = { name: heading[1].trim(), done: 0, total: 0 }
      domains.push(domain)
    }
    const item = line.match(/^\s*- \[([ xX])\]/)
    if (domain && item) {
      domain.total++
      if (item[1] !== ' ') domain.done++
    }
  }
  const done = domains.reduce((sum, d) => sum + d.done, 0)
  const total = domains.reduce((sum, d) => sum + d.total, 0)

  return {
    title: 'API tests (jest, api-tests)',
    lines: [
      `${tests} declared tests in ${files} files${skipped ? ` (${skipped} skipped)` : ''}`,
      `Checklist in TEST_COVERAGE.md: ${done}/${total} covered (${pct(done, total)})`,
      ...domains
        .filter((d) => d.total)
        .map((d) => `  ${d.name}: ${d.done}/${d.total} (${pct(d.done, d.total)})`),
    ],
  }
}

const collectors = [
  args['smoke-json'] && (() => collectSmoke(args['smoke-json'])),
  args['api-dir'] && (() => collectApi(args['api-dir'])),
].filter(Boolean)

if (!collectors.length) {
  console.error('Nothing to report: pass --smoke-json and/or --api-dir')
  process.exit(1)
}

const sections = collectors.map((collect) => {
  const { title, lines } = collect()
  return [
    `*${title}*`,
    ...lines.map((line) => (line.startsWith('  ') ? `  - ${line.trim()}` : `- ${line}`)),
  ].join('\n')
})

console.log([':bar_chart: *Weekly test coverage report*', ...sections].join('\n\n'))
