import { useEffect, useMemo, useRef } from 'react'
import { debounce, isEqual, uniq } from 'es-toolkit'
import { atom, useAtom, useSetAtom } from 'jotai'

import { DataviewCategory, type DataviewInstance } from '@globalfishingwatch/api-types'
import type { AnyDeckLayer } from '@globalfishingwatch/deck-layers'
import { TilesBoundariesLayer } from '@globalfishingwatch/deck-layers'
import { useMemoCompare } from '@globalfishingwatch/react-hooks'

import type { ResolverGlobalConfig } from '../resolvers'
import { dataviewToDeckLayerResolved, getDataviewsResolved, getDataviewsSorted } from '../resolvers'

// Atom used to have all deck instances available
export const deckLayerInstancesAtom = atom<AnyDeckLayer[]>([])

type ResolvedDeckLayer = {
  id: string
  LayerClass: new (props: any) => AnyDeckLayer
  props: any
}
type CachedDeckLayer = { LayerClass: unknown; props: unknown; instance: AnyDeckLayer }

export function useDeckLayerComposer({
  dataviews,
  globalConfig,
}: {
  dataviews: DataviewInstance[]
  globalConfig: ResolverGlobalConfig
}) {
  const [deckLayers, setDeckLayers] = useAtom(deckLayerInstancesAtom)
  const memoDataviews = useMemoCompare(dataviews)
  const memoGlobalConfig = useMemoCompare(globalConfig)

  const debouncedSetDeckLayers = useMemo(() => debounce(setDeckLayers, 1), [setDeckLayers])

  // getDataviewsResolved only reads these fields, so the expensive dataview merge
  // is not re-run when frequently-changing config (zoom, time range, highlights) updates
  const resolutionConfig = useMemoCompare({
    bivariateDataviews: memoGlobalConfig.bivariateDataviews,
    activityVisualizationMode: memoGlobalConfig.activityVisualizationMode,
    detectionsVisualizationMode: memoGlobalConfig.detectionsVisualizationMode,
    environmentVisualizationMode: memoGlobalConfig.environmentVisualizationMode,
    vesselGroupsVisualizationMode: memoGlobalConfig.vesselGroupsVisualizationMode,
    compareStart: memoGlobalConfig.compareStart,
    compareEnd: memoGlobalConfig.compareEnd,
  })

  const dataviewsMergedSorted = useMemo(() => {
    const dataviewsMerged = getDataviewsResolved(
      memoDataviews,
      resolutionConfig
    ) as DataviewInstance[]
    return getDataviewsSorted(dataviewsMerged)
  }, [memoDataviews, resolutionConfig])

  const resolvedLayers = useMemo<ResolvedDeckLayer[]>(() => {
    const resolved =
      dataviewsMergedSorted?.flatMap((dataview): ResolvedDeckLayer | [] => {
        try {
          const { LayerClass, props } = dataviewToDeckLayerResolved(dataview, memoGlobalConfig)
          return { id: dataview.id, LayerClass, props }
        } catch (e) {
          console.warn(e)
          return []
        }
      }) ?? []
    if (memoGlobalConfig.debugTiles) {
      const uniqueVisualizationModes = uniq([
        dataviewsMergedSorted.filter((d) => d.category === DataviewCategory.Activity).length
          ? memoGlobalConfig.activityVisualizationMode
          : undefined,
        dataviewsMergedSorted.filter((d) => d.category === DataviewCategory.Detections).length
          ? memoGlobalConfig.detectionsVisualizationMode
          : undefined,
        dataviewsMergedSorted.filter((d) => d.category === DataviewCategory.Environment).length
          ? memoGlobalConfig.environmentVisualizationMode
          : undefined,
      ]).filter((v) => v !== undefined)
      return [
        ...resolved,
        ...uniqueVisualizationModes.map((visualizationMode, index) => ({
          id: `debug-tiles-${index}`,
          LayerClass: TilesBoundariesLayer as unknown as ResolvedDeckLayer['LayerClass'],
          props: { id: index.toString(), visualizationMode },
        })),
      ]
    }
    return resolved
  }, [dataviewsMergedSorted, memoGlobalConfig])

  const layerCacheRef = useRef<Map<string, CachedDeckLayer>>(new Map())
  const prevInstancesRef = useRef<AnyDeckLayer[]>([])

  useEffect(() => {
    const nextCache = new Map<string, CachedDeckLayer>()
    const instances = resolvedLayers.map(({ id, LayerClass, props }) => {
      const cached = layerCacheRef.current.get(id)
      const instance =
        cached && cached.LayerClass === LayerClass && isEqual(cached.props, props)
          ? cached.instance
          : new LayerClass(props)
      nextCache.set(id, { LayerClass, props, instance })
      return instance
    })
    layerCacheRef.current = nextCache
    const prev = prevInstancesRef.current
    const hasChanges =
      instances.length !== prev.length || instances.some((layer, i) => layer !== prev[i])
    if (hasChanges) {
      prevInstancesRef.current = instances
      debouncedSetDeckLayers(instances)
    }
  }, [resolvedLayers, debouncedSetDeckLayers])

  return deckLayers
}

export function useSetDeckLayerComposer() {
  return useSetAtom(deckLayerInstancesAtom)
}
