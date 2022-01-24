import { useEffect, useMemo } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { GeoJSONFeature, MapDataEvent } from '@globalfishingwatch/maplibre-gl'
import {
  ExtendedStyle,
  HeatmapLayerMeta,
  DEFAULT_CONTEXT_SOURCE_LAYER,
  TEMPORALGRID_SOURCE_LAYER_INTERACTIVE,
} from '@globalfishingwatch/layer-composer'
import {
  isActivityDataview,
  MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { TimeseriesFeatureProps } from '@globalfishingwatch/fourwings-aggregate'
import useMapInstance from 'features/map/map-context.hooks'
import { useMapStyle } from 'features/map/map-style.hooks'
import { mapTilesAtom, TilesAtomSourceState } from 'features/map/map-sources.atom'
import { getHeatmapSourceMetadata } from 'features/map/map-sources.utils'

type SourcesHookInput = string | string[]
// TODO: move this to fork and include sourceId in the event for tiles loaded
type CustomMapDataEvent = MapDataEvent & { sourceId: string; error?: string }

const toArray = (elem) => (Array.isArray(elem) ? elem : [elem])

const getSourcesFromMergedGenerator = (style: ExtendedStyle) => {
  const meta = getHeatmapSourceMetadata(style, MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID)
  return meta.timeChunks.activeSourceId
}

const getGeneratorSourcesIds = (style: ExtendedStyle, sourcesIds: SourcesHookInput) => {
  const sourcesIdsList = toArray(sourcesIds)
  const sources = sourcesIdsList.flatMap((source) => {
    if (source === MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID) {
      return getSourcesFromMergedGenerator(style)
    }
    return source
  })
  return sources
}

export const useSourceInStyle = (sourcesIds: SourcesHookInput) => {
  const style = useMapStyle()
  if (!sourcesIds || !sourcesIds.length) {
    return false
  }
  const sourcesIdsList = getGeneratorSourcesIds(style, sourcesIds)
  const sourcesLoaded = sourcesIdsList.every((source) => style?.sources?.[source] !== undefined)
  return sourcesLoaded
}

export const useMapSourceTilesLoadedAtom = () => {
  // Used it once in Map.tsx the listeners only once
  const map = useMapInstance()
  const setSourceTilesLoaded = useSetRecoilState(mapTilesAtom)

  useEffect(() => {
    if (!map) return

    const onSourceDataLoading = (e: CustomMapDataEvent) => {
      const { sourceId } = e
      if (sourceId) {
        setSourceTilesLoaded((state) => {
          const source = { ...state[sourceId], loaded: false }
          return {
            ...state,
            [sourceId]: source,
          }
        })
      }
    }

    const onSourceTilesLoaded = (e: CustomMapDataEvent) => {
      const { sourceId, error: tileError } = e
      if (sourceId) {
        setSourceTilesLoaded((state) => {
          let error = state[sourceId]?.error
          if (error === undefined && tileError !== undefined) {
            error = tileError || 'Unknown error'
          }
          const styleSources = Object.keys(map.getStyle().sources)
          const stateWithoutCancelledSources = Object.fromEntries(
            Object.entries(state).filter(([source]) => {
              return styleSources.includes(source)
            })
          )
          return {
            ...stateWithoutCancelledSources,
            [sourceId]: { loaded: true, ...(error && { error }) },
          }
        })
      }
    }
    if (map) {
      map.on('dataloading', onSourceDataLoading)
      map.on('sourcetilesdata', onSourceTilesLoaded)
    }
    const detachListeners = () => {
      map.off('dataloading', onSourceDataLoading)
      map.off('sourcetilesdata', onSourceTilesLoaded)
    }

    return detachListeners
  }, [map, setSourceTilesLoaded])
}

export const useMapSourceTiles = () => {
  const sourceTilesLoaded = useRecoilValue(mapTilesAtom)
  return sourceTilesLoaded
}

export const useMapSourceTilesLoaded = (sourcesId: SourcesHookInput) => {
  const style = useMapStyle()
  const sourceTilesLoaded = useMapSourceTiles()
  const sourceInStyle = useSourceInStyle(sourcesId)
  const sourcesIdsList = getGeneratorSourcesIds(style, sourcesId)
  return sourceInStyle && sourcesIdsList.every((source) => sourceTilesLoaded[source]?.loaded)
}

export const useAllMapSourceTilesLoaded = () => {
  const sourceTilesLoaded = useMapSourceTiles()
  const allSourcesLoaded = Object.values(sourceTilesLoaded).every(({ loaded }) => loaded === true)
  return allSourcesLoaded
}

export type DataviewChunkFeature = {
  active: boolean
  state: TilesAtomSourceState
  features: GeoJSONFeature<TimeseriesFeatureProps>[]
  quantizeOffset: number
}
export type DataviewFeature = {
  state: TilesAtomSourceState
  sourceId: string
  dataviewsId: string[]
  features: GeoJSONFeature[]
  chunksFeatures: DataviewChunkFeature[]
  metadata: HeatmapLayerMeta
}

export const areDataviewsFeatureLoaded = (dataviews: DataviewFeature | DataviewFeature[]) => {
  const dataviewsArray: DataviewFeature[] = toArray(dataviews)
  return dataviewsArray.length ? dataviewsArray.every(({ state }) => state?.loaded) : false
}

export const hasDataviewsFeatureError = (dataviews: DataviewFeature | DataviewFeature[]) => {
  const dataviewsArray: DataviewFeature[] = toArray(dataviews)
  return dataviewsArray.length ? dataviewsArray.some(({ state }) => state?.error) : false
}

export const useMapDataviewFeatures = (dataviews: UrlDataviewInstance | UrlDataviewInstance[]) => {
  const style = useMapStyle()
  const map = useMapInstance()
  const sourceTilesLoaded = useMapSourceTiles()
  // Memoized to avoid re-runs on style changes like hovers
  const generatorsMetadata = useMemo(() => style?.metadata?.generatorsMetadata, [style])

  const dataviewsMetadata = useMemo(() => {
    const style = { metadata: { generatorsMetadata } } as ExtendedStyle
    const dataviewsArray = toArray(dataviews)
    const dataviewsMetadata: {
      metadata: HeatmapLayerMeta
      sourceId: string
      dataviewsId: string[]
      filter?: string[]
    }[] = dataviewsArray.reduce((acc, dataview) => {
      const activityDataview = isActivityDataview(dataview)
      if (activityDataview) {
        const existingMergedAnimatedDataviewIndex = acc.findIndex(
          (d) => d.sourceId === MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID
        )
        if (existingMergedAnimatedDataviewIndex >= 0) {
          acc[existingMergedAnimatedDataviewIndex].dataviewsId.push(dataview.id)
          return acc
        }
      }
      const sourceId = activityDataview
        ? MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID
        : dataview.id
      const metadata =
        getHeatmapSourceMetadata(style, sourceId) ||
        ({ sourceLayer: DEFAULT_CONTEXT_SOURCE_LAYER } as HeatmapLayerMeta)
      return acc.concat({
        sourceId,
        metadata,
        dataviewsId: [dataview.id],
        filter: dataview.config.filter,
      })
    }, [])
    return dataviewsMetadata
  }, [dataviews, generatorsMetadata])

  const dataviewFeatures = useMemo(() => {
    const dataviewsFeature = dataviewsMetadata.map(({ dataviewsId, metadata, filter }) => {
      const sourceLayer = metadata?.sourceLayer || TEMPORALGRID_SOURCE_LAYER_INTERACTIVE
      const sourceId = metadata?.timeChunks?.activeSourceId || dataviewsId[0]
      const chunks = metadata?.timeChunks?.chunks.map(({ active, sourceId, quantizeOffset }) => ({
        active,
        sourceId,
        quantizeOffset,
      }))

      const chunksFeatures: DataviewChunkFeature[] | null = chunks
        ? chunks.map(({ active, sourceId, quantizeOffset }) => {
            const emptyChunkState = {} as TilesAtomSourceState
            const chunkState = active
              ? sourceTilesLoaded[sourceId] || { loaded: false }
              : emptyChunkState

            return {
              active,
              features:
                chunkState.loaded && !chunkState.error
                  ? map.querySourceFeatures(sourceId, { sourceLayer, filter })
                  : null,
              quantizeOffset,
              state: chunkState,
            }
          })
        : null
      const state = chunks
        ? ({
            loaded: chunksFeatures.every(({ state }) => state.loaded !== false),
            error: chunksFeatures.filter(({ state }) => state.error).join(','),
          } as TilesAtomSourceState)
        : sourceTilesLoaded[sourceId] || ({} as TilesAtomSourceState)

      const features: GeoJSONFeature[] | null =
        !chunks && state?.loaded && !state?.error
          ? map.querySourceFeatures(sourceId, { sourceLayer, filter })
          : null

      const data: DataviewFeature = {
        sourceId,
        dataviewsId,
        state,
        features,
        chunksFeatures,
        metadata,
      }
      return data
    })
    return dataviewsFeature
  }, [dataviewsMetadata, map, sourceTilesLoaded])

  return dataviewFeatures
}
