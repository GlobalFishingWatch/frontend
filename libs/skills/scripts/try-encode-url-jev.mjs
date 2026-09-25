#!/usr/bin/env node
// Dev harness for the encode-url-jev skill: shows what Jev answered, what the steps decided,
// the draft, and the encoded URL. Not shipped. Run through nx so the bundle is fresh:
//
//   pnpm nx try-jev skills -- "Fishing of Peru, Argentina, Brazil and Chile"
//   pnpm nx try-jev skills -- "and by flag?" --url '<current map url>' --now 2026-07-10
//   pnpm nx try-jev skills -- "<message>" --json > case.json     # full plan, raw answers included
//   pnpm nx try-jev skills -- "<message>" --answers case.json    # replay offline, no API call
//   pnpm nx try-jev skills -- --conversations [--turn 5]         # diff against the transcripts
//
// Add --verbose to print every answer instead of only the non-default ones.
// TYPESAFE_API_KEY is read from the environment or libs/skills/.env.

import { existsSync, readFileSync } from 'node:fs'
import { parseArgs } from 'node:util'

const LIB = new URL('..', import.meta.url)
const ENV_FILE = new URL('.env', LIB)
const TRANSCRIPTS = new URL('src/encode-url/references/examples-conversations.md', LIB)
// The transcripts were recorded around this date ("last week" → 2026-07-03..10)
const TRANSCRIPTS_NOW = '2026-07-10T12:00:00.000Z'

if (existsSync(ENV_FILE)) process.loadEnvFile(ENV_FILE)

const { planMapUrl, encodeMapUrl } = await import(new URL('dist/encode-url-jev/index.js', LIB))
const { decodeMapUrl } = await import(new URL('dist/decode-url/index.js', LIB))

const { values: args, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    url: { type: 'string' },
    now: { type: 'string' },
    answers: { type: 'string' },
    json: { type: 'boolean' },
    verbose: { type: 'boolean' },
    conversations: { type: 'boolean' },
    turn: { type: 'string' },
  },
})

const DIM = '\x1b[2m'
const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const RESET = '\x1b[0m'

// Options that mean "nothing picked": hidden unless --verbose
const DEFAULT_OPTIONS = ['none', 'not_mentioned', 'not_stated', 'info', 'same']

const describeAnswers = (answers, verbose) =>
  Object.entries(answers).flatMap(([key, answer]) => {
    if (answer.type === 'noul') {
      if (!verbose && answer.noul < 0.5) return []
      return [
        `  ${key.padEnd(44)} ${answer.noul >= 0.5 ? 'yes' : 'no '} ${DIM}${answer.noul.toFixed(2)}${RESET}`,
      ]
    }
    const low = answer.confidence < 0.5
    if (!verbose && !low && DEFAULT_OPTIONS.includes(answer.choice)) return []
    const flag = low ? ` ${YELLOW}LOW${RESET}` : ''
    return [
      `  ${key.padEnd(44)} ${answer.choice} ${DIM}conf ${answer.confidence.toFixed(2)}${RESET}${flag}`,
    ]
  })

const encode = (input) => {
  try {
    return encodeMapUrl(input)
  } catch (error) {
    return { error: error.message }
  }
}

const runOne = async ({ message, url, now, answers, verbose }) => {
  const started = Date.now()
  const plan = await planMapUrl({ message, currentUrl: url, now, answers })
  const elapsed = Date.now() - started
  const encoded = encode(plan.draft)
  return { plan, encoded, elapsed, verbose }
}

const printOne = ({ plan, encoded, elapsed, verbose }) => {
  const { jev, decisions, todo, draft, alternatives, seeAlso } = plan
  const rounds = jev.rounds.map(
    ({ steps, questions, usage, ms }, i) =>
      `  round ${i + 1}: ${steps.join(', ')} · ${questions} questions · ${usage?.input_tokens ?? '?'} input tokens · ${ms} ms`
  )
  console.log(`${DIM}Jev ${jev.model} · ${elapsed} ms total\n${rounds.join('\n')}${RESET}\n`)
  console.log('Answers')
  console.log(describeAnswers(jev.answers, verbose).join('\n') || '  (all default)')
  console.log('\nDecisions')
  console.log(JSON.stringify(decisions, null, 2).replace(/^/gm, '  '))
  console.log('\nTodo for the LLM step')
  console.log(todo.length ? todo.map((item) => `  - ${item}`).join('\n') : '  (none)')
  console.log('\nDraft')
  console.log(JSON.stringify(draft, null, 2).replace(/^/gm, '  '))
  if (alternatives) console.log('\nAlternatives\n' + JSON.stringify(alternatives, null, 2))
  if (seeAlso) console.log(`\nSee also: ${seeAlso}`)
  console.log('\nEncoded')
  if (encoded.error) console.log(`  ${RED}${encoded.error}${RESET}`)
  else {
    console.log(`  https://globalfishingwatch.org${encoded.path}`)
    encoded.warnings?.forEach((warning) => console.log(`  ${YELLOW}warning:${RESET} ${warning}`))
  }
}

// --- Transcript comparison --------------------------------------------------------------

const parseTranscripts = () => {
  const turns = []
  let conversation = 0
  let pending
  for (const line of readFileSync(TRANSCRIPTS, 'utf8').split('\n')) {
    if (/^\*\*new conversation/i.test(line)) {
      conversation++
      pending = undefined
    }
    const user = line.match(/^user:\s*(.+)/)
    if (user) pending = user[1].trim()
    const skill = line.match(/^skill:\s*(https?:\/\/\S+)/)
    if (skill && pending) {
      const previous = turns.at(-1)
      turns.push({
        conversation,
        message: pending,
        expected: skill[1],
        url: previous?.conversation === conversation ? previous.expected : undefined,
      })
      pending = undefined
    }
  }
  return turns
}

// App defaults the browser writes into URLs, and viewport (the LLM step estimates it)
const IGNORED_STATE = [
  'latitude',
  'longitude',
  'zoom',
  'tk',
  'timebarSelectedEnvId',
  'reportLoadVessels',
  'reportVesselPage',
  'reportEventsPortsFilter',
  'reportEventsPortsPage',
  'dataviewInstances',
]
const DEFAULT_STATE = { reportCategory: 'activity', timebarVisualisation: 'heatmap' }
const DEFAULT_VISIBLE = ['ais', 'vms']

const layerKey = (id) => {
  const base = id.replace(/__\d+$/, '')
  return { 'fishing-effort-ais': 'ais', 'fishing-effort-vms': 'vms' }[base] ?? base
}

// Semantic view of a URL: layer ids lose their timestamps and colors, context layers are the
// encoder's job, hidden layers only matter for the ones visible by default
const normalize = (url) => {
  const { route, layers, raw } = decodeMapUrl(url)
  const state = Object.fromEntries(
    Object.entries(raw).filter(
      ([key, value]) => !IGNORED_STATE.includes(key) && value !== '' && DEFAULT_STATE[key] !== value
    )
  )
  const signatures = layers
    .filter((layer) => layer.category !== 'context')
    .filter((layer) => layer.visible || DEFAULT_VISIBLE.includes(layerKey(layer.id)))
    .map((layer) => {
      const filters = Object.entries(layer.filters ?? {})
        .filter(([, value]) => value !== '' && !(Array.isArray(value) && !value.length))
        .map(([key, value]) => `${key}=${[value].flat().join(',')}`)
        .sort()
      return `${layerKey(layer.id)}${layer.visible ? '' : ' (hidden)'}${filters.length ? ` [${filters.join(' ')}]` : ''}`
    })
    .sort()
  return {
    route: [route.type, route.datasetId, route.areaId, route.portId, route.vesselId]
      .filter(Boolean)
      .join(' '),
    state,
    layers: signatures,
  }
}

const diff = (expectedUrl, actualPath) => {
  const expected = normalize(expectedUrl)
  const actual = normalize(`https://globalfishingwatch.org${actualPath}`)
  const lines = []
  if (expected.route !== actual.route)
    lines.push(`route: expected "${expected.route}", got "${actual.route}"`)
  const keys = new Set([...Object.keys(expected.state), ...Object.keys(actual.state)])
  for (const key of keys) {
    const [a, b] = [JSON.stringify(expected.state[key]), JSON.stringify(actual.state[key])]
    if (a !== b) lines.push(`${key}: expected ${a ?? '(unset)'}, got ${b ?? '(unset)'}`)
  }
  expected.layers
    .filter((l) => !actual.layers.includes(l))
    .forEach((l) => lines.push(`missing layer: ${l}`))
  actual.layers
    .filter((l) => !expected.layers.includes(l))
    .forEach((l) => lines.push(`extra layer:   ${l}`))
  return lines
}

const runConversations = async () => {
  const turns = parseTranscripts()
  const selected = args.turn ? [turns[Number(args.turn)]].filter(Boolean) : turns
  let passed = 0
  for (const turn of selected) {
    const index = turns.indexOf(turn)
    const { plan, encoded } = await runOne({
      message: turn.message,
      url: turn.url,
      now: args.now ?? TRANSCRIPTS_NOW,
    })
    const problems = encoded.error
      ? [`encoder error: ${encoded.error}`]
      : diff(turn.expected, encoded.path)
    if (!problems.length) passed++
    const mark = problems.length ? `${RED}✘${RESET}` : `${GREEN}✔${RESET}`
    console.log(`${mark} #${index} ${turn.url ? `${DIM}(follow-up)${RESET} ` : ''}${turn.message}`)
    problems.forEach((line) => console.log(`    ${line}`))
    plan.todo.forEach((item) => console.log(`    ${DIM}todo: ${item}${RESET}`))
  }
  console.log(
    `\n${passed}/${selected.length} turns match (viewport, colors and context layers ignored)`
  )
}

// --- Main -------------------------------------------------------------------------------

if (args.conversations) {
  await runConversations()
} else {
  const message = positionals.join(' ')
  if (!message) {
    console.error(
      'Usage: try-encode-url-jev.mjs "<message>" [--url <map url>] [--now <iso>] [--answers file.json] [--json] [--verbose] | --conversations [--turn n]'
    )
    process.exit(1)
  }
  const answers = args.answers
    ? JSON.parse(readFileSync(args.answers, 'utf8')).jev.answers
    : undefined
  const result = await runOne({
    message,
    url: args.url,
    now: args.now,
    answers,
    verbose: args.verbose,
  })
  if (args.json) console.log(JSON.stringify({ ...result.plan, encoded: result.encoded }, null, 2))
  else printOne(result)
}
