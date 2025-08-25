import type { NextApiRequest, NextApiResponse } from 'next'

import { getOceanAreaName, type OceanAreaLocale } from '@globalfishingwatch/ocean-areas'

export type GetOceanAreaNameRequest = {
  latitude: number
  longitude: number
  zoom: number
  locale?: OceanAreaLocale
  combineWithEEZ?: boolean
}

export type GetOceanAreaNameResponse = {
  success: boolean
  message: string
  data?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetOceanAreaNameResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST.',
    })
  }

  try {
    const { latitude, longitude, zoom, locale, combineWithEEZ }: GetOceanAreaNameRequest =
      req.body || {}

    if (latitude === undefined || longitude === undefined || zoom === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Latitude, longitude, and zoom parameters are required',
      })
    }

    const areaName = await getOceanAreaName(
      { latitude, longitude, zoom },
      { locale, combineWithEEZ }
    )

    return res.status(200).json({
      success: true,
      message: 'Ocean area name retrieved successfully',
      data: areaName,
    })
  } catch (error: any) {
    console.error('Get ocean area name error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}
