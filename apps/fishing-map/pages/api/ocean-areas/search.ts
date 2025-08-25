import type { NextApiRequest, NextApiResponse } from 'next'

import {
  type OceanAreaLocale,
  type OceanAreaType,
  searchOceanAreas,
} from '@globalfishingwatch/ocean-areas'

export type SearchOceanAreasRequest = {
  query: string
  locale?: OceanAreaLocale
  types?: OceanAreaType[]
}

export type SearchOceanAreasResponse = {
  success: boolean
  message: string
  data?: any[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchOceanAreasResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST.',
    })
  }

  try {
    const { query, locale, types }: SearchOceanAreasRequest = req.body || {}

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter is required',
      })
    }

    const areas = await searchOceanAreas(query, { locale, types })

    return res.status(200).json({
      success: true,
      message: 'Ocean areas found successfully',
      data: areas,
    })
  } catch (error: any) {
    console.error('Search ocean areas error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}
