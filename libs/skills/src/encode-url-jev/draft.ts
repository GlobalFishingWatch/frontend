import { getLayerInfo } from '../encode-url/dictionary'
import type { EncodeMapUrlInput, MapState } from '../encode-url/encode'
import type { MapRoute } from '../encode-url/routes'

import type { FiltersDecision } from './steps/filters'
import { DURATION_RANGE } from './steps/filters'
import type { LayersDecision } from './steps/layers'
import { layerKey, LAYERS } from './steps/layers'
import type { ModeDecision } from './steps/mode'
import type { Area, AreaTypesDecision, PlacesDecision } from './steps/places'
import { getEez, NATIONAL_VMS_DATASETS } from './steps/places'
import type { ReportDecision } from './steps/report'
import type { AccountDecision, RouteDecision, SearchDecision } from './steps/route'
import type { PlanContext } from './steps/step'
import type { PeriodDecision, TimeDecision } from './steps/time'

// Deterministic rules that turn the Jev decisions into an encodeMapUrl input. Everything here
// used to be prose in encode-url/SKILL.md; no model call happens in this file.

/** One entry per step, keyed by step name (see plan.ts for the order they resolve in) */
export type Decisions = {
  mode: ModeDecision
  route: RouteDecision
  account: AccountDecision
  search: SearchDecision
  layers: LayersDecision
  areaTypes: AreaTypesDecision
  places: PlacesDecision
  period: PeriodDecision
  time: TimeDecision | undefined
  filters: FiltersDecision
  report: ReportDecision
}

export type Draft = {
  draft: EncodeMapUrlInput
  /** Other equally valid views ("workspace_and_report"): encode and offer them too */
  alternatives?: EncodeMapUrlInput[]
  seeAlso?: string
}

type Instance = {
  id: string
  dataviewId?: string
  category?: string
  config?: {
    visible?: boolean
    color?: string
    colorRamp?: string
    datasets?: string[]
    filters?: Record<string, unknown>
  }
  datasetsConfig?: unknown[]
}

/** Values only the final LLM step can fill. SKILL.md tells it to replace every one */
export const placeholder = (field: string) => `TODO:${field}`

// Ramp + paired hex (references/query-params.md), for extra instances of a same category
const PALETTE = [
  { colorRamp: 'lilac', color: '#9CA4FF' },
  { colorRamp: 'salmon', color: '#FFAE9B' },
  { colorRamp: 'sky', color: '#00EEFF' },
  { colorRamp: 'orange', color: '#FFAA0D' },
  { colorRamp: 'magenta', color: '#FF64CE' },
  { colorRamp: 'green', color: '#A6FF59' },
  { colorRamp: 'yellow', color: '#FFEA00' },
  { colorRamp: 'red', color: '#FF6854' },
]
const WORLD_VIEWPORT = { latitude: 0, longitude: 0, zoom: 0.8 }
// Visible in the default workspace: must be hidden explicitly when not wanted
const DEFAULT_VISIBLE_LAYERS = ['ais', 'vms']
// A whole-world report keeps every default activity, detection and event layer visible
const GLOBAL_REPORT_LAYERS = [
  'ais',
  'vms',
  'presence',
  'sar',
  'sentinel2',
  'viirs',
  'encounters',
  'loitering',
  'port-visits',
]
const MAP_ROUTES = ['workspace', 'report', 'workspace_and_report', 'same']
const categoryOf = (id: string) => getLayerInfo(layerKey(id)).category
const isVisible = (instance: Instance) => instance.config?.visible !== false

// URL filters replace the dataview defaults, so a filtered encounters layer must carry the app's
// default encounter types too (same reason the encoder adds distance_from_port_km to AIS)
const DEFAULT_ENCOUNTER_TYPES = [
  'FISHING-CARRIER',
  'CARRIER-FISHING',
  'FISHING-SUPPORT',
  'SUPPORT-FISHING',
]
const withDefaultEncounterTypes = (instance: Instance): Instance => {
  const filters = instance.config?.filters
  if (layerKey(instance.id) !== 'encounters' || !filters || !Object.keys(filters).length)
    return instance
  if (filters.encounter_type) return instance
  return {
    ...instance,
    config: {
      ...instance.config,
      filters: { ...filters, encounter_type: DEFAULT_ENCOUNTER_TYPES },
    },
  }
}

const getLayerFilters = (id: string, d: Decisions, flags: string[]) => {
  const key = layerKey(id)
  const category = categoryOf(id)
  const filters: Record<string, unknown> = { ...d.filters.byLayer[key] }
  if (category === 'detections' && d.filters.dark) filters.matched = ['false']
  if (category === 'events' && d.filters.duration) filters.duration = d.filters.duration
  // Dark detections have no flag: only matched detections carry one
  const takesFlag =
    ['activity', 'events'].includes(category) || (category === 'detections' && !d.filters.dark)
  if (flags.length && takesFlag) filters.flag = flags
  return filters
}

const newInstance = (
  id: string,
  d: Decisions,
  uniqueId: number,
  flags = d.places.flags
): Instance => {
  const spec = LAYERS[id]
  const filters = getLayerFilters(id, d, flags)
  const config = { visible: true, ...(Object.keys(filters).length && { filters }) }
  if (categoryOf(id) === 'environment' && id !== 'bathymetry') {
    return {
      id: `${id}__${uniqueId}`,
      dataviewId: getLayerInfo(id).dataviewId,
      category: 'environment',
      config: { ...spec?.palette, ...config },
      ...(spec?.envDataset && {
        datasetsConfig: [
          {
            datasetId: spec.envDataset,
            endpoint: '4wings-tiles',
            params: [{ id: 'type', value: 'heatmap' }],
          },
        ],
      }),
    }
  }
  if (id === 'vms') {
    // A national dataset is more complete than the global VMS mix for its own country
    const countries = [...d.places.flags, ...d.places.areaCountries]
    const datasets = countries.map((iso3) => NATIONAL_VMS_DATASETS[iso3]).filter(Boolean)
    if (datasets.length) {
      // Each national dataset holds only its own fleet: a flag filter on top is redundant
      const { flag: _flag, ...otherFilters } = filters
      const vmsFilters = flags.every((iso3) => NATIONAL_VMS_DATASETS[iso3]) ? otherFilters : filters
      const hasFilters = Object.keys(vmsFilters).length > 0
      return { id, config: { visible: true, ...(hasFilters && { filters: vmsFilters }), datasets } }
    }
  }
  return withDefaultEncounterTypes({ id, config })
}

const createIdSequence = (now: Date) => {
  let next = now.getTime()
  return () => next++
}

const buildLayers = (d: Decisions, nextId: () => number): Instance[] => {
  const perFlag = d.places.flags.length > 1 && !d.places.combineFlags
  const instances = d.layers.ids.flatMap((id): Instance[] => {
    if (id !== 'ais' || !perFlag) return [newInstance(id, d, nextId())]
    // Compare flags side by side: one fishing layer per flag, each in its own color
    return d.places.flags.map((flag, i) => {
      const instance = newInstance('ais', d, 0, [flag])
      if (i === 0) return instance
      return {
        ...instance,
        id: `fishing-effort-ais__${nextId()}`,
        config: { ...instance.config, ...PALETTE[(i - 1) % PALETTE.length] },
      }
    })
  })
  if (!d.layers.ids.length) return instances
  const hidden = DEFAULT_VISIBLE_LAYERS.filter((id) => !d.layers.ids.includes(id))
  return [...instances, ...hidden.map((id) => ({ id, config: { visible: false } }))]
}

const getFocus = (ids: string[]) => {
  const categories = new Set(ids.map(categoryOf))
  if (categories.has('activity')) return undefined
  if (categories.has('events')) return { timebarVisualisation: 'events', reportCategory: 'events' }
  if (categories.has('detections')) {
    return { timebarVisualisation: 'heatmapDetections', reportCategory: 'detections' }
  }
  return undefined
}

const getTimeState = (time?: TimeDecision) => (time ? { start: time.start, end: time.end } : {})

const getViewport = (d: Decisions, ctx: PlanContext) => {
  if (!d.places.namesPlace) return WORLD_VIEWPORT
  ctx.todo.push(
    'Set state.latitude, state.longitude and state.zoom to frame the place(s) named in the message (zoom ~4-6 for a country, ~2-3 for an ocean region).'
  )
  return {}
}

const getReportState = (d: Decisions) => ({
  ...(d.report.eventsGraph && { reportEventsGraph: d.report.eventsGraph }),
  ...(d.report.buffer && {
    reportBufferValue: d.report.buffer.value,
    reportBufferUnit: d.report.buffer.unit,
    reportBufferOperation: 'dissolve',
  }),
})

const getReportAreas = (d: Decisions, ctx: PlanContext): Area[] => {
  const areas = [
    ...d.places.areaCountries.flatMap((iso3) => getEez(iso3, ctx.todo)),
    ...d.places.areas,
  ]
  if (!d.places.mpa) return areas
  ctx.todo.push(
    'Replace TODO:areaId with the marine protected area id (datasetId public-mpa-all) of the MPA named in the message.'
  )
  return [...areas, { datasetId: 'public-mpa-all', areaId: placeholder('areaId'), label: 'MPA' }]
}

const toReportRoute = (areas: Area[]): MapRoute => ({
  type: 'report',
  datasetId: areas.map((area) => area.datasetId).join(','),
  areaId: areas.map((area) => area.areaId).join(','),
})

const buildMapDraft = (d: Decisions, ctx: PlanContext): Draft => {
  const nextId = createIdSequence(ctx.now)
  const focus = getFocus(d.layers.ids)
  const state: MapState = {
    dataviewInstances: buildLayers(d, nextId) as MapState['dataviewInstances'],
    ...getTimeState(d.time),
    ...(focus && { timebarVisualisation: focus.timebarVisualisation }),
  }
  const workspace = (): EncodeMapUrlInput => ({
    route: { type: 'workspace' },
    state: { ...state, ...getViewport(d, ctx) },
  })
  const report = (): EncodeMapUrlInput | undefined => {
    const reportState = {
      ...state,
      ...(focus && { reportCategory: focus.reportCategory }),
      ...getReportState(d),
    }
    const areas = getReportAreas(d, ctx)
    if (areas.length) return { route: toReportRoute(areas), state: reportState }
    if (!d.route.global && d.places.namesPlace) {
      ctx.todo.push(
        'The message asks for a report but the place has no area id in references/areas.json: the draft is a map view instead. If it is an EEZ, FAO area or RFMO under another name, grep areas.json and switch to a report.'
      )
      return undefined
    }
    const wanted = d.layers.ids.filter((id) => !GLOBAL_REPORT_LAYERS.includes(id))
    return {
      route: { type: 'report' },
      state: {
        ...reportState,
        ...WORLD_VIEWPORT,
        dataviewInstances: [...GLOBAL_REPORT_LAYERS, ...wanted].map((id) => {
          const instance = newInstance(id, d, nextId())
          // Filters only on the layers the message asked about
          return d.layers.ids.includes(id) ? instance : { id, config: { visible: true } }
        }) as MapState['dataviewInstances'],
      },
    }
  }

  if (d.route.type === 'report') return { draft: report() ?? workspace() }
  if (d.route.type === 'workspace_and_report') {
    const reportDraft = report()
    return { draft: workspace(), ...(reportDraft && { alternatives: [reportDraft] }) }
  }
  return { draft: workspace() }
}

const MMSI_REGEX = /\b\d{9}\b/
const IMO_REGEX = /\bIMO\s*:?\s*(\d{7})\b/i
const ADVANCED_SEARCH_FIELDS = [
  'ssvid',
  'imo',
  'flag',
  'transmissionDateFrom',
  'transmissionDateTo',
]

const getSearchState = (base: MapState, d: Decisions, ctx: PlanContext): MapState => {
  const mmsi = ctx.message.match(MMSI_REGEX)?.[0]
  const imo = ctx.message.match(IMO_REGEX)?.[1]
  const state: MapState = {
    ...base,
    ...(mmsi && { ssvid: mmsi }),
    ...(imo && { imo }),
    ...(d.places.flags.length && { flag: d.places.flags }),
    ...(d.time && { transmissionDateFrom: d.time.firstDay, transmissionDateTo: d.time.lastDay }),
  }
  if (d.search.vesselName) state.query = d.search.vesselName
  const advanced = ADVANCED_SEARCH_FIELDS.some(
    (field) => state[field] !== undefined && state[field] !== ''
  )
  if (advanced) state.searchOption = 'advanced'
  else if (state.query) state.searchOption = 'basic'
  return state
}

const buildNew = (d: Decisions, ctx: PlanContext): Draft => {
  switch (d.route.type) {
    case 'user':
      return { draft: { route: { type: 'user' }, state: { userTab: d.account.userTab } } }
    case 'workspaces-list':
      return { draft: { route: { type: 'workspaces-list', category: 'marine-manager' } } }
    case 'vessel-search':
      return { draft: { route: { type: 'vessel-search' }, state: getSearchState({}, d, ctx) } }
    case 'vessel':
      ctx.todo.push(
        'Replace TODO:vesselId with the GFW vessel id: search the vessel first (vessel-search) if the message only gives a name, MMSI or IMO.'
      )
      return {
        draft: {
          route: { type: 'vessel', vesselId: placeholder('vesselId') },
          state: { vesselDatasetId: 'public-global-vessel-identity:v4.0', ...getTimeState(d.time) },
        },
      }
    case 'ports-report':
      ctx.todo.push(
        'Replace TODO:portId with the port id (grep references/ports.json by port name) and set portsReportName / portsReportCountry from the same entry.'
      )
      return {
        draft: {
          route: { type: 'ports-report', portId: placeholder('portId') },
          state: {
            dataviewInstances: [
              {
                id: 'port-visits',
                config: { visible: true, filters: { port_id: placeholder('portId') } },
              },
              { id: 'ais', config: { visible: false } },
              { id: 'vms', config: { visible: false } },
            ],
            timebarVisualisation: 'events',
            portsReportDatasetId: 'public-global-port-visits-events:v4.0',
            ...getTimeState(d.time),
          },
        },
      }
    default:
      return buildMapDraft(d, ctx)
  }
}

const setFilter = (instances: Instance[], id: string, value: unknown) => {
  instances.forEach((instance) => {
    instance.config = {
      ...instance.config,
      filters: { ...instance.config?.filters, [id]: value },
    }
  })
}

// The layer a follow-up talks about when it names none: the first visible one of the
// category the current view focuses on (report tab or timebar)
const getPrimaryLayer = (instances: Instance[], state: MapState) => {
  const timebar = state.timebarVisualisation
  const focus =
    (state.reportCategory as string) ||
    (timebar === 'events' ? 'events' : timebar === 'heatmapDetections' ? 'detections' : 'activity')
  return instances.find((instance) => isVisible(instance) && categoryOf(instance.id) === focus)
}

const buildFollowUp = (
  d: Decisions,
  ctx: PlanContext,
  current: NonNullable<PlanContext['current']>
): Draft => {
  const type = d.route.type === 'same' ? current.route.type : d.route.type
  if (current.route.type === 'vessel-search' && type === 'vessel-search') {
    return { draft: { route: current.route, state: getSearchState(current.raw, d, ctx) } }
  }
  if (!MAP_ROUTES.includes(type) || !['workspace', 'report'].includes(current.route.type)) {
    return buildNew({ ...d, route: { ...d.route, type: type as RouteDecision['type'] } }, ctx)
  }

  // Everything the message doesn't mention is kept verbatim: viewport, buffer, fTD/lTD, layers
  const state = structuredClone(current.raw) as MapState
  let route: MapRoute = current.route
  const nextId = createIdSequence(ctx.now)
  const instances = (state.dataviewInstances ?? []) as Instance[]

  Object.assign(state, getTimeState(d.time))

  // Named layers: show the existing instance, or add a new one
  const named = d.layers.ids.map((id) => {
    const existing = instances.find((instance) => layerKey(instance.id) === id)
    if (existing) {
      existing.config = { ...existing.config, visible: true }
      return existing
    }
    const added = newInstance(id, d, nextId(), [])
    instances.push(added)
    return added
  })

  // Filters are edited in place on every visible layer of the kind they were asked for
  for (const [key, filters] of Object.entries(d.filters.byLayer)) {
    const hosts = instances.filter(
      (instance) => isVisible(instance) && layerKey(instance.id) === key
    )
    Object.entries(filters).forEach(([filterId, values]) => setFilter(hosts, filterId, values))
  }
  if (d.filters.dark) {
    const detections = instances.filter(
      (instance) => isVisible(instance) && categoryOf(instance.id) === 'detections'
    )
    setFilter(detections, 'matched', ['false'])
  }
  // Flags and durations go to the layers the message names, else to the one the view focuses on
  const primary = getPrimaryLayer(instances, state)
  const targets = named.length ? named : primary ? [primary] : []
  if (d.filters.duration) {
    setFilter(
      targets.filter((instance) => categoryOf(instance.id) === 'events'),
      'duration',
      d.filters.duration
    )
  }
  if (d.places.flags.length) setFilter(targets, 'flag', d.places.flags)
  // Widening a filter the same message sets a value for ("other gear: trawlers") is not a clear
  const clear = d.mode.clearFilter
  const setsValue =
    clear === 'flag'
      ? d.places.flags.length > 0
      : Object.values(d.filters.byLayer).some((filters) => filters[clear ?? ''])
  if (clear && !setsValue) {
    const key = clear
    // An emptied key is a cleared filter; a dropped key would bring back the dataview default
    setFilter(
      instances.filter((instance) => instance.config?.filters?.[key] !== undefined),
      key,
      ''
    )
  }
  state.dataviewInstances = instances.map(
    withDefaultEncounterTypes
  ) as MapState['dataviewInstances']

  // Places: report areas change the route, otherwise the viewport moves
  const areas = getReportAreas(d, ctx)
  const toReport = type === 'report' || current.route.type === 'report' || d.mode.restrictToArea
  if (areas.length && toReport) {
    const kept =
      d.mode.addArea && route.datasetId && route.areaId
        ? route.datasetId.split(',').map((datasetId, i) => ({
            datasetId,
            areaId: route.areaId!.split(',')[i],
            label: '',
          }))
        : []
    route = toReportRoute([...kept, ...areas])
  } else if (d.places.namesPlace && route.type === 'workspace') {
    getViewport(d, ctx)
  }

  if (route.type === 'report') {
    const focus = getFocus(d.layers.ids)
    if (focus) Object.assign(state, focus)
    if (d.report.eventsGraph) state.reportEventsGraph = d.report.eventsGraph
    // Keep a buffer the user already set
    if (d.report.buffer && state.reportBufferValue === undefined)
      Object.assign(state, getReportState(d))
  }

  return { draft: { route, state } }
}

export const buildDraft = (d: Decisions, ctx: PlanContext): Draft => {
  const asksEvents =
    d.layers.ids.some((id) => categoryOf(id) === 'events') ||
    ctx.current?.layers.some((layer) => layer.visible && layer.category === 'events')
  if (d.filters.durationMissingHours && asksEvents) {
    ctx.todo.push(
      `The message limits event duration but no hour count was found: set config.filters.duration to ["<min>", "<max>"] hours within ${DURATION_RANGE.join('-')}.`
    )
  }
  const result =
    ctx.current && d.mode.followUp ? buildFollowUp(d, ctx, ctx.current) : buildNew(d, ctx)
  return { ...result, ...(d.places.seeAlso && { seeAlso: d.places.seeAlso }) }
}
