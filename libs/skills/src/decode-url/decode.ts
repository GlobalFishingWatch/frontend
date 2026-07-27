import type { BaseUrlWorkspace } from '@globalfishingwatch/dataviews-client'
import { parseWorkspace } from '@globalfishingwatch/dataviews-client'

import type { LayerCategory } from '../encode-url/dictionary'
import { getLayerInfo } from '../encode-url/dictionary'
import type { MapRoute } from '../encode-url/routes'
import { DEFAULT_BASENAME, matchRoutePath } from '../encode-url/routes'

import { HIGHLIGHTED_WORKSPACES } from './workspaces'

export type DecodedLayer = {
  id: string
  dataviewId?: string
  name: string
  category: LayerCategory
  visible: boolean
  filters?: Record<string, unknown>
  color?: string
}

export type DecodedMapUrl = {
  route: MapRoute
  /** Curated workspace name (marine-manager, global reports…) when the workspaceId is a known one */
  workspaceName?: string
  timeRange?: { start?: string; end?: string }
  viewport?: { latitude?: number; longitude?: number; zoom?: number }
  timebarVisualisation?: string
  layers: DecodedLayer[]
  report?: Record<string, unknown>
  vessel?: Record<string, unknown>
  search?: Record<string, unknown>
  /** Full parsed workspace state, pass it back to encodeMapUrl to reproduce the url */
  raw: BaseUrlWorkspace & Record<string, unknown>
}

const pickByPrefix = (state: Record<string, unknown>, prefixes: string[]) => {
  const entries = Object.entries(state).filter(([key]) =>
    prefixes.some((prefix) => key.startsWith(prefix))
  )
  return entries.length ? Object.fromEntries(entries) : undefined
}

export const decodeMapUrl = (
  url: string,
  { basename = DEFAULT_BASENAME }: { basename?: string } = {}
): DecodedMapUrl => {
  const { pathname, search } = new URL(url, 'https://globalfishingwatch.org')
  const appPathname = pathname.startsWith(basename) ? pathname.slice(basename.length) : pathname
  const route = matchRoutePath(appPathname)
  const state = parseWorkspace(search) as DecodedMapUrl['raw']

  const layers: DecodedLayer[] = (state.dataviewInstances || []).flatMap((instance) => {
    if (!instance?.id) return []
    const { name, category } = getLayerInfo(instance.id)
    return [
      {
        id: instance.id,
        ...(instance.dataviewId && { dataviewId: String(instance.dataviewId) }),
        name,
        category,
        visible: instance.config?.visible !== false,
        ...(instance.config?.filters && { filters: instance.config.filters }),
        ...(instance.config?.color && { color: instance.config.color }),
      },
    ]
  })

  const { start, end, latitude, longitude, zoom, timebarVisualisation } = state as Record<
    string,
    any
  >

  const workspaceName = route.workspaceId && HIGHLIGHTED_WORKSPACES[route.workspaceId]

  return {
    route,
    ...(workspaceName && { workspaceName }),
    ...((start || end) && { timeRange: { start, end } }),
    ...(latitude !== undefined && { viewport: { latitude, longitude, zoom } }),
    ...(timebarVisualisation && { timebarVisualisation }),
    layers,
    report: pickByPrefix(state, ['report', 'portsReport']),
    vessel: pickByPrefix(state, ['vessel', 'visibleEvents']),
    search: pickByPrefix(state, ['query', 'searchOption', 'infoSource']),
    raw: state,
  }
}
