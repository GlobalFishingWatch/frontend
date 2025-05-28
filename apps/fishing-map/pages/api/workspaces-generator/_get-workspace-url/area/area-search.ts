import { matchSorter } from 'match-sorter'

import type { AreaParams } from 'pages/api/workspaces-generator/_get-workspace-url/types'

import eez from './data/eez.json'
import fao from './data/fao.json'
import mpas from './data/mpas.json'
import rfmo from './data/rfmo.json'

export type AreaType = 'fao' | 'rfmo' | 'eez' | 'mpa'
export type AreaDataset = 'public-fao-major' | 'public-rfmo' | 'public-eez-areas' | 'public-mpa-all'
export type AreaSearchResult = {
  dataset: AreaDataset | string
  id: string
  label: string
  type?: AreaType
}

const AREAS_CONFIG: Record<AreaType, { data: any[]; dataset: AreaDataset }> = {
  eez: {
    data: eez,
    dataset: 'public-eez-areas',
  },
  fao: {
    data: fao,
    dataset: 'public-fao-major',
  },
  rfmo: {
    data: rfmo,
    dataset: 'public-rfmo',
  },
  mpa: {
    data: mpas,
    dataset: 'public-mpa-all',
  },
}

export const searchAreas = ({ name } = {} as AreaParams) => {
  const matches: AreaSearchResult[] = []

  if (!name) {
    return matches
  }

  for (const [type, { data, dataset }] of Object.entries(AREAS_CONFIG)) {
    const matchingAreas = matchSorter(data as [{ id: string; label: string }], name, {
      keys: ['label'],
      threshold: matchSorter.rankings.CONTAINS,
    })
    const matchingAreasWithoutSubareas = matchingAreas.filter(
      (area) =>
        !area.label.includes('Overlapping') &&
        !area.label.includes('Joint regime') &&
        !area.label.endsWith(')')
    )

    if (matchingAreasWithoutSubareas.length) {
      matches.push(
        ...matchingAreasWithoutSubareas.map((area) => ({
          ...area,
          dataset,
          type: type as AreaType,
        }))
      )
      break
    }

    if (matchingAreas.length) {
      matches.push(...matchingAreas.map((area) => ({ ...area, dataset, type: type as AreaType })))
      break
    }
  }

  return matches
}
