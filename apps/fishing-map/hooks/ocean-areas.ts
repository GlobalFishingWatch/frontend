import type { OceanArea, OceanAreaLocale, OceanAreaType } from '@globalfishingwatch/ocean-areas'

import { PATH_BASENAME } from 'data/config'
import type { MapCoordinates } from 'types'

export function useOceanAreas() {
  const searchOceanAreas = async ({
    query,
    locale,
    types,
  }: {
    query: string
    locale: OceanAreaLocale
    types?: OceanAreaType[]
  }): Promise<OceanArea[]> => {
    const response = await fetch(`${PATH_BASENAME}/api/ocean-areas/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        locale,
        types,
      }),
    })
    if (!response.ok) {
      console.error('Failed to search ocean areas', response.statusText)
      return []
    }
    const data = await response.json()
    return data.data || []
  }

  const getOceanAreaName = async ({
    viewport,
    locale,
    combineWithEEZ,
  }: {
    viewport: MapCoordinates
    locale: OceanAreaLocale
    combineWithEEZ?: boolean
  }): Promise<string> => {
    const response = await fetch(`${PATH_BASENAME}/api/ocean-areas/name`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...viewport,
        locale,
        combineWithEEZ,
      }),
    })
    if (!response.ok) {
      console.error('Failed to get ocean area name', response.statusText)
      return ''
    }
    const data = await response.json()
    return data.data || ''
  }
  return { searchOceanAreas, getOceanAreaName }
}
