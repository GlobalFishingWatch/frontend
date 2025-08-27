import { useCallback, useRef } from 'react'

import type { OceanArea, OceanAreaLocale, OceanAreaType } from '@globalfishingwatch/ocean-areas'

import { PATH_BASENAME } from 'data/config'
import type { MapCoordinates } from 'types'

type SearchOceanAreasParams = {
  query: string
  locale: OceanAreaLocale
  types?: OceanAreaType[]
}

type GetOceanAreaNameParams = {
  viewport: MapCoordinates
  locale: OceanAreaLocale
  combineWithEEZ?: boolean
}

const API_CALL_TIMEOUT = 300

const searchOceanAreasFn = async (params: SearchOceanAreasParams): Promise<OceanArea[]> => {
  const { query, locale, types } = params || {}
  if (!query) {
    return []
  }
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

const getOceanAreaNameFn = async (params: GetOceanAreaNameParams): Promise<string> => {
  const { viewport, locale, combineWithEEZ } = params || {}
  if (!viewport) {
    return ''
  }
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

export function useOceanAreas() {
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const getAreaNameTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const searchOceanAreas = useCallback(
    async (params: SearchOceanAreasParams): Promise<OceanArea[]> => {
      return new Promise((resolve) => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current)
        }
        searchTimeoutRef.current = setTimeout(async () => {
          const result = await searchOceanAreasFn(params)
          resolve(result)
        }, API_CALL_TIMEOUT)
      })
    },
    []
  )
  const getOceanAreaName = useCallback(async (params: GetOceanAreaNameParams): Promise<string> => {
    return new Promise((resolve) => {
      if (getAreaNameTimeoutRef.current) {
        clearTimeout(getAreaNameTimeoutRef.current)
      }
      getAreaNameTimeoutRef.current = setTimeout(async () => {
        const result = await getOceanAreaNameFn(params)
        resolve(result)
      }, API_CALL_TIMEOUT)
    })
  }, [])

  return {
    searchOceanAreas,
    getOceanAreaName,
  }
}
