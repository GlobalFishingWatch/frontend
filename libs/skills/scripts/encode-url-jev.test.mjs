// Offline checks for the encode-url-jev draft rules: fixed Jev answers in, encoder input out.
// No API call. Run with `pnpm nx test skills` (builds dist first).
import assert from 'node:assert/strict'
import { test } from 'node:test'

const { planMapUrl, encodeMapUrl } = await import(
  new URL('../dist/encode-url-jev/index.js', import.meta.url)
)

const NOW = '2026-07-10T12:00:00.000Z'
// Only the answers that matter: missing nouls read as "no", missing choices as their fallback
const yes = { type: 'noul', noul: 0.95 }
const pick = (choice, others = []) => ({
  type: 'choice',
  choice,
  confidence: 0.9,
  probabilities: Object.fromEntries([
    [choice, 0.95],
    ...others.map((o) => [o, 0.05 / others.length]),
  ]),
})
const flag = pick('vessel_flag', ['not_mentioned', 'area'])

test('multi-country fishing → one AIS layer per flag, VMS hidden', async () => {
  const { draft, todo } = await planMapUrl({
    message: 'Fishing of Peru, Argentina, Brazil and Chile',
    now: NOW,
    answers: {
      'layers.ais': yes,
      'route.type': pick('workspace'),
      'areaTypes.country': yes,
      'places.country.PER': flag,
      'places.country.ARG': flag,
      'places.country.BRA': flag,
      'places.country.CHL': flag,
    },
  })
  assert.deepEqual(draft.route, { type: 'workspace' })
  const instances = draft.state.dataviewInstances
  assert.deepEqual(
    instances.map((i) => [i.id.replace(/__\d+$/, ''), i.config.filters?.flag?.[0] ?? null]),
    [
      ['ais', 'ARG'],
      ['fishing-effort-ais', 'BRA'],
      ['fishing-effort-ais', 'CHL'],
      ['fishing-effort-ais', 'PER'],
      ['vms', null],
    ]
  )
  assert.equal(instances.at(-1).config.visible, false)
  assert.equal(new Set(instances.slice(1, 4).map((i) => i.config.colorRamp)).size, 3)
  assert.match(todo.join('\n'), /state\.latitude/)
})

test('"other gear types" follow-up clears the filter in place and keeps the rest', async () => {
  const current = encodeMapUrl({
    route: { type: 'report', datasetId: 'public-rfmo', areaId: 'IATTC' },
    state: {
      dataviewInstances: [
        { id: 'ais', config: { filters: { geartype: ['squid_jigger'] } } },
        { id: 'vms', config: { visible: false } },
      ],
      start: '2024-01-01T00:00:00.000Z',
      end: '2025-01-01T00:00:00.000Z',
      reportBufferValue: 100,
    },
  })
  const { draft, todo } = await planMapUrl({
    message: 'is there fishing from other gear types?',
    currentUrl: current.path,
    now: NOW,
    answers: {
      'mode.clear_filter': pick('geartype', ['none']),
      'route.type': pick('same'),
      'layers.ais': yes,
    },
  })
  assert.deepEqual(todo, [])
  assert.equal(draft.route.areaId, 'IATTC')
  const ais = draft.state.dataviewInstances.find((i) => i.id === 'ais')
  assert.equal(ais.config.filters.geartype, '')
  assert.equal(ais.config.filters.distance_from_port_km, '3')
  assert.equal(draft.state.start, '2024-01-01T00:00:00.000Z')
  assert.equal(String(draft.state.reportBufferValue), '100')
})

test('date parts → exclusive end, unstated year = most recent past one', async () => {
  const range = async (answers) =>
    (await planMapUrl({ message: '', now: NOW, answers })).draft.state
  const period = (parts) =>
    Object.fromEntries([
      ['period.kind', pick(parts.end_month || parts.end_year ? 'range' : 'period')],
      ...Object.entries(parts).map(([key, value]) => [`time.${key}`, pick(value)]),
    ])
  const cases = [
    [{ start_year: '2025', start_month: 'May' }, '2025-05-01', '2025-06-01'],
    [{ start_year: '2025' }, '2025-01-01', '2026-01-01'],
    [{ start_month: 'June' }, '2026-06-01', '2026-07-01'],
    [{ start_month: 'July', start_day: '5' }, '2026-07-05', '2026-07-06'],
    [{ start_month: 'November', end_month: 'February' }, '2025-11-01', '2026-03-01'],
  ]
  for (const [parts, start, end] of cases) {
    const state = await range(period(parts))
    assert.deepEqual(
      [state.start.slice(0, 10), state.end.slice(0, 10)],
      [start, end],
      JSON.stringify(parts)
    )
  }
  const relative = await range({
    'period.kind': pick('relative'),
    'time.relative_unit': pick('day'),
    'time.relative_count': pick('7'),
  })
  assert.deepEqual(
    [relative.start.slice(0, 10), relative.end.slice(0, 10)],
    ['2026-07-03', '2026-07-10']
  )
})
