import { choice, noul } from '@typesafe-ai/sdk'

import { flags } from '@globalfishingwatch/i18n-labels'

import { HIGHLIGHTED_WORKSPACES } from '../../decode-url/workspaces'
import AREAS from '../../encode-url/references/areas.json'
import type { AnswerReader } from '../jev'

import type { PlanContext, Step } from './step'

// Places, in two rounds: first which kinds of place the message names (areaTypes), then only
// the candidates of those kinds (places). A message naming no FAO area asks no FAO questions.

export type Area = { datasetId: string; areaId: string; label: string }

const EEZ_DATASET = 'public-eez-areas'
const FAO_AREAS = (AREAS as Area[]).filter((area) => area.datasetId === 'public-fao-major')
const RFMO_AREAS = (AREAS as Area[]).filter((area) => area.datasetId === 'public-rfmo')

// National fishing-effort datasets (references/layers.md), keyed by flag ISO3
export const NATIONAL_VMS_DATASETS: Record<string, string> = {
  BLZ: 'public-belize-fishing-effort:v20220304',
  BRA: 'public-vms-bra-fishing-effort:v4.0',
  CHL: 'public-vms-chl-fishing-effort:v4.1',
  CRI: 'public-vms-cri-fishing-effort:v4.0',
  ECU: 'public-vms-ecu-fishing-effort:v4.0',
  NOR: 'public-vms-nor-fishing-effort:v4.0',
  PAN: 'public-vms-pan-fishing-effort:v4.1',
  PER: 'public-vms-per-fishing-effort:v4.0',
  PNG: 'public-vms-png-fishing-effort:v4.0',
}

// Curated workspaces are "see also" links only, never a base for the state
const REPORT_WORKSPACES = ['activity-report', 'detections-report', 'events-report']
const CURATED = Object.entries(HIGHLIGHTED_WORKSPACES).filter(
  ([id, name]) => id !== 'default-public' && !name.endsWith('(report)')
)
const getCuratedPath = (id: string) => {
  if (REPORT_WORKSPACES.includes(id)) return `/platform/map/reports/${id}/report`
  if (id === 'deep-sea-mining-public') return `/platform/map/fishing-activity/${id}`
  return `/platform/map/marine-manager/${id}`
}

type CountryRole = 'not_mentioned' | 'vessel_flag' | 'area'

export type PlacesDecision = {
  /** ISO3 of countries whose vessels the message asks about */
  flags: string[]
  /** One layer with every flag (a total) instead of one layer per flag (a comparison) */
  combineFlags: boolean
  /** ISO3 of countries whose waters the message asks about */
  areaCountries: string[]
  /** FAO and RFMO areas named. EEZs come from `areaCountries` via getEez, only for reports */
  areas: Area[]
  /** A marine protected area is named: its id is not in areas.json, the final LLM step finds it */
  mpa: boolean
  /** Any geographic place is named, so a map view needs a viewport over it */
  namesPlace: boolean
  /** Curated workspace link to add as "see also" */
  seeAlso?: string
}

// Literal reading: "FAO 87 Pacific, Southeast (Southeast Pacific)" as one phrase is almost never
// "mentioned" (0.16 for "include FAO 87"); code or name as alternatives is (0.94)
const describeArea = ({ datasetId, areaId, label }: Area) => {
  if (datasetId !== 'public-fao-major') return label
  const name = label.match(/\(([^)]+)\)/)?.[1] ?? label.replace(`FAO ${areaId}`, '').trim()
  return `FAO area ${areaId} or the ${name}`
}

// "Mentioned at all" and "in which role" are read separately: a 0.65 flag / 0.35 area split has
// low confidence, but the country is clearly mentioned and flag is the better guess
const getCountryRole = (read: AnswerReader, iso3: string, ctx: PlanContext): CountryRole => {
  const probabilities = read.probabilities(`places.country.${iso3}`)
  const flag = probabilities.vessel_flag ?? 0
  const area = probabilities.area ?? 0
  if (flag + area < 0.5) return 'not_mentioned'
  const role = flag >= area ? 'vessel_flag' : 'area'
  if (Math.min(flag, area) > 0.25) {
    ctx.todo.push(
      `${flags[iso3]} read as ${role === 'vessel_flag' ? 'a vessel flag' : 'an area'} (flag ${flag.toFixed(2)}, area ${area.toFixed(2)}): swap it if the message means the other.`
    )
  }
  return role
}

// Label convention in areas.json: "<Country> EEZ"
export const getEez = (iso3: string, todo: string[]): Area[] => {
  const label = `${flags[iso3]} EEZ`.toLowerCase()
  const eez = (AREAS as Area[]).find(
    (area) => area.datasetId === EEZ_DATASET && area.label.toLowerCase() === label
  )
  if (!eez) {
    todo.push(
      `No EEZ labelled "${flags[iso3]} EEZ" in references/areas.json: grep it for ${flags[iso3]} and add the matching { datasetId, areaId } to the report route.`
    )
    return []
  }
  return [eez]
}

export type AreaTypesDecision = {
  /** A country, its vessels or its waters/EEZ */
  country: boolean
  fao: boolean
  rfmo: boolean
  /** A marine protected area: its id is not in areas.json, the final LLM step finds it */
  mpa: boolean
  /** Any geographic place, so a map view needs a viewport over it */
  named: boolean
}

const AREA_TYPES: Record<keyof AreaTypesDecision, string> = {
  country:
    'a country, its people or vessels, or its waters or EEZ, e.g. "Spain", "Spanish vessels", "Brazil EEZ"',
  fao: 'an FAO major fishing area or an ocean region, e.g. "FAO 41", "Southwest Atlantic", "Mediterranean"',
  rfmo: 'a regional fisheries management organization (RFMO), e.g. "IATTC", "ICCAT", "IOTC"',
  mpa: 'a marine protected area, marine reserve or national park, e.g. "Galápagos"',
  named: 'any geographic place: a country, sea, ocean, island, area or region',
}

export const areaTypesStep: Step<AreaTypesDecision> = {
  needs: [],
  questions() {
    return Object.fromEntries(
      Object.entries(AREA_TYPES).map(([type, description]) => [
        `areaTypes.${type}`,
        noul(`Do the words of \`message\` itself name ${description}?`),
      ])
    )
  },
  resolve(read) {
    const types = Object.fromEntries(
      Object.keys(AREA_TYPES).map((type) => [type, read.yes(`areaTypes.${type}`)])
    ) as AreaTypesDecision
    // Naming a specific place is naming a place
    return { ...types, named: Object.values(types).some(Boolean) }
  },
}

// ponytail: when a country is named, all 251 are asked in parallel (~12k tokens, well under
// Jev's 64k), which also catches demonyms ("Spanish vessels"). Prefilter by name/ISO3 if
// latency ever matters.
export const placesStep: Step<PlacesDecision, 'areaTypes'> = {
  needs: ['areaTypes'],
  questions(_ctx, { areaTypes }) {
    const areas = [...(areaTypes.fao ? FAO_AREAS : []), ...(areaTypes.rfmo ? RFMO_AREAS : [])]
    return {
      ...(areaTypes.country &&
        Object.fromEntries(
          Object.entries(flags).map(([iso3, name]) => [
            `places.country.${iso3}`,
            choice(`How does \`message\` refer to ${name}?`, {
              not_mentioned: `${name} is not mentioned`,
              vessel_flag: `Vessels of ${name}, flagged to ${name}, e.g. "fishing of ${name}", "${name} vessels"`,
              area: `The waters, coast or zone of ${name}, e.g. "in ${name}", "around ${name}"`,
            }),
          ])
        )),
      ...(areaTypes.country && {
        'places.combine_flags': noul(
          'Does `message` ask for the vessels of several countries added together into one total, rather than compared side by side?'
        ),
      }),
      ...Object.fromEntries(
        areas.map((area) => [
          `places.area.${area.datasetId}.${area.areaId}`,
          noul(`Does \`message\` name ${describeArea(area)}?`),
        ])
      ),
      ...(areaTypes.named && {
        'places.curated': choice(
          'Which of these regions or programmes does `message` mention?',
          Object.fromEntries([['none', 'None of them'], ...CURATED])
        ),
      }),
    }
  },
  resolve(read, ctx, { areaTypes }) {
    const roles = areaTypes.country
      ? Object.keys(flags).map((iso3) => ({ iso3, role: getCountryRole(read, iso3, ctx) }))
      : []
    const curated = read.choice('places.curated', 'the curated workspace', 'none', { quiet: true })
    return {
      flags: roles.filter(({ role }) => role === 'vessel_flag').map(({ iso3 }) => iso3),
      combineFlags: read.yes('places.combine_flags'),
      areaCountries: roles.filter(({ role }) => role === 'area').map(({ iso3 }) => iso3),
      areas: [...FAO_AREAS, ...RFMO_AREAS].filter((area) =>
        read.yes(`places.area.${area.datasetId}.${area.areaId}`)
      ),
      mpa: areaTypes.mpa,
      namesPlace: areaTypes.named,
      ...(curated !== 'none' && { seeAlso: getCuratedPath(curated) }),
    }
  },
}
