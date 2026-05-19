import { createFileRoute } from '@tanstack/react-router'

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

export const Route = createFileRoute('/api/ocean-areas/name')({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const body = await request.json().catch(() => ({}))
        const { latitude, longitude, zoom, locale, combineWithEEZ }: GetOceanAreaNameRequest =
          body || {}

        if (latitude === undefined || longitude === undefined || zoom === undefined) {
          return Response.json(
            {
              success: false,
              message: 'Latitude, longitude, and zoom parameters are required',
            },
            { status: 400 }
          )
        }

        try {
          const areaName = await getOceanAreaName(
            { latitude, longitude, zoom },
            { locale, combineWithEEZ }
          )

          return Response.json({
            success: true,
            message: 'Ocean area name retrieved successfully',
            data: areaName,
          })
        } catch (error: any) {
          console.error('Get ocean area name error:', error.message)
          return Response.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
          )
        }
      },
    },
  },
})
