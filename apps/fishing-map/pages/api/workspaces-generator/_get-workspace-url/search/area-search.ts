import { matchSorter } from 'match-sorter'

import eez from '../data/eez.json'
import fao from '../data/fao.json'
import mpas from '../data/mpas.json'
import rfmo from '../data/rfmo.json'

type AreaType = 'fao' | 'rfmo' | 'eez' | 'mpa'
type AreaDataset = 'public-fao-major' | 'public-rfmo' | 'public-eez-areas' | 'public-mpa-all'
type Area = {
  type: AreaType
  dataset: AreaDataset
  id: string
  label: string
}

const AREAS_CONFIG: Record<AreaType, { data: any; dataset: AreaDataset }> = {
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

export const searchArea = async (areaId: string) => {
  let bestMatch: Area | null = null

  for (const [type, { data, dataset }] of Object.entries(AREAS_CONFIG) as [
    AreaType,
    { data: any[]; dataset: AreaDataset },
  ][]) {
    const matchingAreas = matchSorter(data, areaId, {
      keys: ['label'],
    })
    if (matchingAreas.length) {
      bestMatch = { ...matchingAreas[0], dataset, type }
      break
    }
  }

  return bestMatch
}
