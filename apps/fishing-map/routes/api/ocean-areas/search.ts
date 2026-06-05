import { createFileRoute } from '@tanstack/react-router'

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

export const Route = createFileRoute('/api/ocean-areas/search')({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const body = await request.json().catch(() => ({}))
        const { query, locale, types }: SearchOceanAreasRequest = body || {}

        if (!query) {
          return Response.json(
            { success: false, message: 'Query parameter is required' },
            { status: 400 }
          )
        }

        try {
          const areas = await searchOceanAreas(query, { locale, types })

          return Response.json({
            success: true,
            message: 'Ocean areas found successfully',
            data: areas,
          })
        } catch (error: any) {
          console.error('Search ocean areas error:', error.message)
          return Response.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
          )
        }
      },
    },
  },
})
