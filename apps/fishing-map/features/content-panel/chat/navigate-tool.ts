import type { RoutePathValues } from '@fishing-map/config/routes'
import { ROUTE_PATHS } from '@fishing-map/config/routes'
import { z } from 'zod'

const allowedTos = new Set<string>(Object.values(ROUTE_PATHS))

/** Client-side validation for the agent's `navigate` tool input. */
export const navigateToolInputSchema = z.object({
  navigation: z.object({
    to: z
      .string()
      .refine((to): to is RoutePathValues => allowedTos.has(to), {
        message: 'Unknown route path',
      }),
    params: z.record(z.string(), z.unknown()).optional(),
    search: z.record(z.string(), z.unknown()).optional(),
  }),
  path: z.string().optional(),
})

export type NavigateToolInput = z.infer<typeof navigateToolInputSchema>
