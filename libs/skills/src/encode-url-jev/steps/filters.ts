import { choice, noul } from '@typesafe-ai/sdk'

import { resolveDataviewSlug } from '../../encode-url/config'
import { getLayerInfo } from '../../encode-url/dictionary'
import datasetFilters from '../../encode-url/references/dataset-filters.json'

import { layerKey } from './layers'
import { NATIONAL_VMS_DATASETS } from './places'
import type { PlanContext, Step } from './step'

// Filters, asked last: which filters exist depends on the layers that were picked and, for VMS,
// on the countries (national datasets). Filter ids and values come from dataset-filters.json,
// the API's own enums, so a new gear type or target species needs no code change here.

type DatasetFilter = { id: string; enum?: (string | number)[] }
type DatasetFiltersJson = {
  dataviews: Record<string, string[]>
  datasets: Record<string, { filters?: Record<string, DatasetFilter[]> }>
}
const DATASET_FILTERS = datasetFilters as unknown as DatasetFiltersJson

// Not asked here: flags come from the places step, distance_from_port_km is an encoder default,
// ids can't be named by a user, duration is a number (regex below)
const SKIPPED_FILTERS = [
  'flag',
  'vessel-groups',
  'distance_from_port_km',
  'next_port_id',
  'port_id',
  'duration',
]
// Layers whose dataviews dataset-filters.json doesn't cover yet (values from references/filters.md).
// `fishing` is left out of vessel_type on purpose: "fishing" alone would read as that filter
const MANUAL_FILTERS: Record<string, Record<string, string[]>> = {
  presence: {
    vessel_type: ['passenger', 'cargo', 'carrier', 'support', 'bunker', 'seismic_vessel'],
  },
}
const FILTER_LABELS: Record<string, string> = { geartype: 'gear type', type: 'vessel type' }
const MAX_OPTIONS = 254 // Jev accepts 255 options per Choice, one is `none`
// Options at or above this probability are all applied: "Anchova" matches two target_species
const MULTI_VALUE = 0.2
/** Event duration filter range, in hours */
export const DURATION_RANGE = [2, 48]
const HOURS_REGEX = /(\d+(?:\.\d+)?)\s*(?:h|hrs?|hours?)\b/i

const labelOf = (filterId: string) => FILTER_LABELS[filterId] ?? filterId.replaceAll('_', ' ')

/** Filter id → values a layer supports, taken from the datasets it will actually use */
export const getLayerFilterOptions = (layer: string, countries: string[]) => {
  if (MANUAL_FILTERS[layer]) return MANUAL_FILTERS[layer]
  const dataviewId = getLayerInfo(layer).dataviewId
  if (!dataviewId) return {}
  const national = countries.map((iso3) => NATIONAL_VMS_DATASETS[iso3]).filter(Boolean)
  const datasets =
    layer === 'vms' && national.length
      ? national
      : (DATASET_FILTERS.dataviews[resolveDataviewSlug(dataviewId)] ?? [])
  const options: Record<string, Set<string>> = {}
  for (const datasetId of datasets) {
    const filters = Object.values(DATASET_FILTERS.datasets[datasetId]?.filters ?? {}).flat()
    for (const filter of filters) {
      if (SKIPPED_FILTERS.includes(filter.id) || !filter.enum?.length) continue
      options[filter.id] ??= new Set()
      filter.enum
        .filter((value) => value !== '')
        .forEach((value) => options[filter.id].add(String(value)))
    }
  }
  return Object.fromEntries(
    Object.entries(options).map(([id, values]) => [id, [...values].slice(0, MAX_OPTIONS)])
  )
}

// The layers filters can land on: the ones the message names. A follow-up that names none
// ("only trawlers") filters the layer the current view focuses on (report tab or timebar), not
// every layer on the map: a 9-layer global report would otherwise get 9 layers of guesses
const getTargetLayers = (ctx: PlanContext, ids: string[]) => {
  if (ids.length || !ctx.current) return ids
  const { reportCategory, timebarVisualisation } = ctx.current.raw as Record<string, unknown>
  const focus =
    (reportCategory as string) ||
    (timebarVisualisation === 'events'
      ? 'events'
      : timebarVisualisation === 'heatmapDetections'
        ? 'detections'
        : 'activity')
  const primary = ctx.current.layers.find((layer) => layer.visible && layer.category === focus)
  return primary ? [layerKey(primary.id)] : []
}

export type FiltersDecision = {
  /** Layer key → filter id → values, e.g. { ais: { geartype: ['squid_jigger'] } } */
  byLayer: Record<string, Record<string, string[]>>
  /** Detections not matched to AIS (`matched: false`) */
  dark: boolean
  /** Event duration as the app's [min, max] string pair */
  duration?: [string, string]
  /** A duration limit was asked but no hour count was found in the message */
  durationMissingHours?: boolean
}

// The number is text extraction, which Jev is not built for: a regex finds it, code clamps it
const getDuration = (bound: string, message: string): Partial<FiltersDecision> => {
  const hours = Number(message.match(HOURS_REGEX)?.[1])
  if (!Number.isFinite(hours)) return { durationMissingHours: true }
  const [min, max] = DURATION_RANGE
  const clamped = String(Math.min(Math.max(hours, min), max))
  return { duration: bound === 'min' ? [clamped, String(max)] : [String(min), clamped] }
}

export const filtersStep: Step<FiltersDecision, 'layers' | 'places'> = {
  needs: ['layers', 'places'],
  questions(ctx, { layers, places }) {
    const targets = getTargetLayers(ctx, layers.ids)
    const countries = [...places.flags, ...places.areaCountries]
    const category = (id: string) => getLayerInfo(id).category
    return {
      ...Object.fromEntries(
        targets.flatMap((layer) =>
          Object.entries(getLayerFilterOptions(layer, countries)).map(([filterId, values]) => {
            const label = labelOf(filterId)
            return [
              `filters.${layer}.${filterId}`,
              choice(
                `Which ${label} does \`message\` ask to show for ${getLayerInfo(layer).name}?`,
                {
                  none: `No specific ${label} is named, including "other ${label}s" or "any ${label}"`,
                  ...Object.fromEntries(
                    values.map((value) => [
                      value,
                      value.includes('_') ? value.replaceAll('_', ' ') : null,
                    ])
                  ),
                }
              ),
            ]
          })
        )
      ),
      ...(targets.some((id) => category(id) === 'detections') && {
        'filters.dark': noul(
          'Does `message` ask about dark vessels, meaning vessels that do not broadcast AIS?'
        ),
      }),
      ...(targets.some((id) => category(id) === 'events') && {
        'filters.duration': choice('Does `message` limit how long the events last?', {
          none: 'No duration limit',
          min: 'A minimum duration, e.g. "more than 12 hours", "at least 5 hours"',
          max: 'A maximum duration, e.g. "less than 6 hours", "up to 3 hours"',
        }),
      }),
    }
  },
  resolve(read, ctx, { layers, places }) {
    const countries = [...places.flags, ...places.areaCountries]
    const byLayer: FiltersDecision['byLayer'] = {}
    for (const layer of getTargetLayers(ctx, layers.ids)) {
      for (const filterId of Object.keys(getLayerFilterOptions(layer, countries))) {
        const probabilities = read.probabilities(`filters.${layer}.${filterId}`)
        const none = probabilities.none ?? 1
        if (none >= 0.5) continue
        const values = Object.entries(probabilities)
          .filter(([value, probability]) => value !== 'none' && probability >= MULTI_VALUE)
          .sort(([, a], [, b]) => b - a)
          .map(([value]) => value)
        if (!values.length) continue
        if (none > 0.3) {
          ctx.todo.push(
            `${labelOf(filterId)} filter on ${layer} set to ${values.join(', ')} (no-filter ${none.toFixed(2)}): remove it if the message doesn't ask for it.`
          )
        }
        byLayer[layer] = { ...byLayer[layer], [filterId]: values }
      }
    }
    const durationBound = read.choice('filters.duration', 'the event duration limit', 'none')
    return {
      byLayer,
      dark: read.yes('filters.dark'),
      ...(durationBound !== 'none' && getDuration(durationBound, ctx.message)),
    }
  },
}
