import { z } from 'zod'

export const navigateDef = {
  name: 'navigate',
  description:
    'Navigate the client to a GFW map view. Runs on the CLIENT: the client ' +
    'applies TanStack Router navigation and loads the map, then reports what ' +
    'it observed. Always call this after building a map URL via encode-url — ' +
    'never just paste the URL.',
  inputSchema: z.object({
    navigation: z.object({
      to: z.string().describe('TanStack Router `to` path from encode-url'),
      params: z.record(z.string(), z.unknown()).optional(),
      search: z.record(z.string(), z.unknown()).optional(),
    }),
    path: z
      .string()
      .describe(
        'Path + query from encode-url (e.g. /map/fishing-activity/default-public?…). ' +
          'Used for iframe / external navigation.'
      ),
  }),
  outputSchema: z.object({
    ok: z.boolean(),
    detail: z.string(),
  }),
}
