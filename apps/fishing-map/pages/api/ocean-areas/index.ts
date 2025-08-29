import type { NextApiRequest, NextApiResponse } from 'next'

export type OceanAreasApiInfo = {
  endpoints: {
    name: string
    path: string
    method: string
    description: string
    parameters: {
      name: string
      type: string
      required: boolean
      description: string
    }[]
  }[]
}

export default function handler(req: NextApiRequest, res: NextApiResponse<OceanAreasApiInfo>) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      endpoints: [],
    })
  }

  const apiInfo: OceanAreasApiInfo = {
    endpoints: [
      {
        name: 'Search Ocean Areas',
        path: '/api/ocean-areas/search',
        method: 'POST',
        description:
          'Search for ocean areas by query string with optional filtering by type and locale',
        parameters: [
          {
            name: 'query',
            type: 'string',
            required: true,
            description: 'Search query string',
          },
          {
            name: 'locale',
            type: 'OceanAreaLocale',
            required: false,
            description: 'Locale for area names (en, es, fr, id)',
          },
          {
            name: 'types',
            type: 'OceanAreaType[]',
            required: false,
            description: 'Filter by area types (eez, mpa, fao, rfmo, port)',
          },
        ],
      },
      {
        name: 'Get Ocean Area Name',
        path: '/api/ocean-areas/name',
        method: 'POST',
        description: 'Get the ocean area name for a specific viewport (latitude, longitude, zoom)',
        parameters: [
          {
            name: 'latitude',
            type: 'number',
            required: true,
            description: 'Latitude coordinate',
          },
          {
            name: 'longitude',
            type: 'number',
            required: true,
            description: 'Longitude coordinate',
          },
          {
            name: 'zoom',
            type: 'number',
            required: true,
            description: 'Zoom level',
          },
          {
            name: 'locale',
            type: 'OceanAreaLocale',
            required: false,
            description: 'Locale for area names (en, es, fr, id)',
          },
          {
            name: 'combineWithEEZ',
            type: 'boolean',
            required: false,
            description: 'Whether to combine ocean area name with EEZ name',
          },
        ],
      },
    ],
  }

  return res.status(200).json(apiInfo)
}
