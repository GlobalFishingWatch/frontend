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

export const searchArea = ({ name } = {} as AreaParams) => {
  let bestMatch: AreaSearchResult | null = null

  if (!name) {
    return bestMatch
  }

  for (const [type, { data, dataset }] of Object.entries(AREAS_CONFIG)) {
    const matchingAreas = matchSorter(data as [{ id: string; label: string }], name, {
      keys: ['label'],
    })
    if (matchingAreas.length) {
      bestMatch = { ...matchingAreas[0], dataset, type: type as AreaType }
      break
    }
  }

  return bestMatch
}
