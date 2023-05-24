import { useEffect, useMemo } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { GeoJSONFeature, MapDataEvent, MapGeoJSONFeature } from '@globalfishingwatch/maplibre-gl'
import {
  ExtendedStyle,
  HeatmapLayerMeta,
  TEMPORALGRID_LAYER_INTERACTIVE_SUFIX,
  TEMPORALGRID_SOURCE_LAYER_INTERACTIVE,
} from '@globalfishingwatch/layer-composer'
import {
  isHeatmapAnimatedDataview,
  isMergedAnimatedGenerator,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { TimeseriesFeatureProps } from '@globalfishingwatch/fourwings-aggregate'
import { useMemoCompare } from '@globalfishingwatch/react-hooks'
import { ChunkFeature, LayerFeature } from '@globalfishingwatch/features-aggregate'
import useMapInstance from 'features/map/map-context.hooks'
import { useMapStyle } from 'features/map/map-style.hooks'
import { mapTilesAtom, TilesAtomSourceState } from 'features/map/map-sources.atom'
import {
  getHeatmapSourceMetadata,
  getSourceMetadata,
  isInteractionSource,
} from 'features/map/map-sources.utils'
import {
  BIG_QUERY_EVENTS_PREFIX,
  ENCOUNTER_EVENTS_SOURCE_ID,
} from 'features/dataviews/dataviews.utils'

type SourcesHookInput = string | string[]
// TODO: move this to fork and include sourceId in the event for tiles loaded
type CustomMapDataEvent = MapDataEvent & { sourceId: string; error?: string }

const toArray = (elem) => (Array.isArray(elem) ? elem : [elem])

const getSourcesFromMergedGenerator = (style: ExtendedStyle, mergeId: string) => {
  const meta = getHeatmapSourceMetadata(style, mergeId)
  return meta?.timeChunks.activeSourceId
}

const getGeneratorSourcesIds = (style: ExtendedStyle, sourcesIds: SourcesHookInput) => {
  const sourcesIdsList = toArray(sourcesIds)
  const sources = sourcesIdsList.flatMap((source) => {
    if (isMergedAnimatedGenerator(source)) {
      return getSourcesFromMergedGenerator(style, source)
    }
    return source
  })
  return sources
}

export const useSourceInStyle = (sourcesIds: SourcesHookInput) => {
  const style = useMapStyle()
  if (!sourcesIds || !sourcesIds.length || !style) {
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
      if (sourceId && !isInteractionSource(sourceId)) {
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
      if (sourceId && !isInteractionSource(sourceId)) {
        setSourceTilesLoaded((state) => {
          let error = state[sourceId]?.error
          if (error === undefined && tileError !== undefined) {
            error = tileError || 'Unknown error'
          }
          return {
            ...state,
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

export const useMapSourceTiles = (sourcesId?: SourcesHookInput) => {
  const sourceTilesLoaded = useRecoilValue(mapTilesAtom)
  const sourcesIdsList = toArray(sourcesId)
  const sourcesLoaded = sourcesId
    ? Object.fromEntries(
        Object.entries(sourceTilesLoaded).filter(([id, source]) => {
          return sourcesIdsList.includes(id)
        })
      )
    : sourceTilesLoaded
  return useMemoCompare(sourcesLoaded)
}

export const useMapSourceTilesLoaded = (sourcesId: SourcesHookInput) => {
  const style = useMapStyle()
  const sourceTilesLoaded = useMapSourceTiles()
  const sourceInStyle = useSourceInStyle(sourcesId)
  const sourcesIdsList = getGeneratorSourcesIds(style, sourcesId)
  const allSourcesLoaded = sourcesIdsList.map((source) => sourceTilesLoaded[source]?.loaded)
  return sourceInStyle && allSourcesLoaded.every((loaded) => loaded)
}

const CLUSTERS_SOURCES_IDS = [ENCOUNTER_EVENTS_SOURCE_ID, BIG_QUERY_EVENTS_PREFIX]
export const useMapClusterTilesLoaded = () => {
  const sourceTilesLoaded = useMapSourceTiles()
  return Object.entries(sourceTilesLoaded)
    .filter(([source]) => CLUSTERS_SOURCES_IDS.some((id) => source.includes(id)))
    .every(([source, state]) => state?.loaded)
}

export const useAllMapSourceTilesLoaded = () => {
  const style = useMapStyle()
  const sources = Object.keys(style?.sources || {})
  const sourceTilesLoaded = useMapSourceTiles()
  const allSourcesLoaded = sources
    .filter((sourceId) => !isInteractionSource(sourceId))
    .every((source) => sourceTilesLoaded[source]?.loaded === true)
  return allSourcesLoaded
}

export type DataviewFeature = LayerFeature & {
  dataviewsId: string[]
}

export const areDataviewsFeatureLoaded = (dataviews: DataviewFeature | DataviewFeature[]) => {
  const dataviewsArray: DataviewFeature[] = toArray(dataviews)
  return dataviewsArray.length ? dataviewsArray.every(({ state }) => state?.loaded) : false
}

export const hasDataviewsFeatureError = (dataviews: DataviewFeature | DataviewFeature[]) => {
  const dataviewsArray: DataviewFeature[] = toArray(dataviews)
  return dataviewsArray.length ? dataviewsArray.some(({ state }) => state?.error) : false
}

type DataviewMetadata = {
  metadata: HeatmapLayerMeta
  sourcesId: string[]
  generatorSourceId: string
  dataviewsId: string[]
  filter?: string[]
}

// Key used to refresh activity graph only when active chunk changes and we can safely ignore the rest of the metadata
function getGeneratorsMetadataChangeKey(generatorsMetadata: Record<string, HeatmapLayerMeta> = {}) {
  if (!generatorsMetadata) return ''
  return Object.keys(generatorsMetadata)
    .map((key) => {
      const metadata = generatorsMetadata[key]
      const timeChunks = [
        metadata.timeChunks.activeSourceId,
        (metadata.timeChunks.chunks || [])
          .map(({ active, sourceId, quantizeOffset }) => [
            active,
            sourceId,
            quantizeOffset,
            (metadata.sublayers || []).map((s) => s.id).join(','),
          ])
          .join('|'),
      ].join('-')
      return [metadata.sourceLayer, timeChunks, metadata.visibleSublayers].join('_')
    })
    .join('+')
}

export type MapLayerFeaturesQueryMethod = 'render' | 'source'
export type MapDataviewFeaturesParams = {
  queryMethod: MapLayerFeaturesQueryMethod
  queryCacheKey?: string
}
export const useMapDataviewFeatures = (
  dataviews: UrlDataviewInstance | UrlDataviewInstance[],
  { queryMethod = 'source', queryCacheKey = '' } = {} as MapDataviewFeaturesParams
) => {
  const style = useMapStyle()
  const map = useMapInstance()

  // Memoized to avoid re-runs on style changes like hovers
  const memoizedDataviews = useMemoCompare(dataviews)
  const metadataKey = getGeneratorsMetadataChangeKey(style?.metadata?.generatorsMetadata)

  const dataviewsMetadata = useMemo(() => {
    const dataviewsArray = toArray(memoizedDataviews || [])
    if (!dataviewsArray || !dataviewsArray.length) {
      return []
    }
    const dataviewsMetadata: DataviewMetadata[] = dataviewsArray.reduce((acc, dataview) => {
      const activityDataview = isHeatmapAnimatedDataview(dataview)
      const { metadata, generatorSourceId } = getSourceMetadata(style, dataview)
      // As metadata is not updated instantly when a dataview changes
      // we skip sublayers of the metadata when the dataview is not active anymore
      if (
        metadata?.sublayers &&
        !metadata.sublayers.some((sublayer) => sublayer.id === dataview.id)
      ) {
        return acc
      }
      if (activityDataview) {
        const existingMergedAnimatedDataviewIndex = acc.findIndex(
          (d) => d.generatorSourceId === generatorSourceId
        )
        if (existingMergedAnimatedDataviewIndex >= 0) {
          acc[existingMergedAnimatedDataviewIndex].dataviewsId.push(dataview.id)
          return acc
        }
      }
      const sourcesId =
        metadata?.timeChunks?.chunks.flatMap(({ sourceId }) => sourceId) || generatorSourceId
      return acc.concat({
        metadata,
        sourcesId,
        generatorSourceId,
        dataviewsId: [dataview.id],
        filter: dataview.config.filter,
      })
    }, [] as DataviewMetadata[])
    return dataviewsMetadata
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoizedDataviews, metadataKey])

  const sourcesIds = dataviewsMetadata.flatMap(({ sourcesId }) => sourcesId)
  const sourceTilesLoaded = useMapSourceTiles(sourcesIds)

  const dataviewFeatures = useMemo(() => {
    const dataviewsFeature = dataviewsMetadata.map(
      ({ dataviewsId, metadata, filter = [''], generatorSourceId }) => {
        const sourceLayer = metadata?.sourceLayer || TEMPORALGRID_SOURCE_LAYER_INTERACTIVE
        const chunks = metadata?.timeChunks?.chunks.map(({ active, sourceId, quantizeOffset }) => ({
          active,
          sourceId,
          quantizeOffset,
        }))
        const chunksFeatures: ChunkFeature[] = chunks
          ? chunks.map(({ active, sourceId = '', quantizeOffset }) => {
              const emptyChunkState = {} as TilesAtomSourceState
              const chunkState = sourceTilesLoaded[sourceId] || emptyChunkState
              let features = [] as MapGeoJSONFeature[]
              if (chunkState.loaded && !chunkState.error) {
                if (queryMethod === 'render') {
                  const layer =
                    metadata?.sourceLayer || sourceId + `-${TEMPORALGRID_LAYER_INTERACTIVE_SUFIX}`
                  features = map.queryRenderedFeatures(undefined, {
                    layers: [layer],
                  })
                } else {
                  features = map.querySourceFeatures(sourceId, { sourceLayer, filter })
                }
              }
              return {
                active,
                features: features as unknown as GeoJSONFeature<TimeseriesFeatureProps>[],
                quantizeOffset,
                state: chunkState,
              }
            })
          : []
        const sourceId = metadata?.timeChunks?.activeSourceId || generatorSourceId
        const state = chunks
          ? ({
              loaded: chunksFeatures!.every(({ state }) => state.loaded !== false),
              error: chunksFeatures!
                .filter(({ state }) => state.error)
                .map(({ state }) => state.error)
                .join(','),
            } as TilesAtomSourceState)
          : sourceTilesLoaded[sourceId] || ({} as TilesAtomSourceState)

        let features: GeoJSONFeature[] = []

        if (!chunks && state?.loaded && !state?.error) {
          if (queryMethod === 'render') {
            features = map.queryRenderedFeatures(undefined, { layers: [sourceId] })
          } else {
            features = map.querySourceFeatures(sourceId, { sourceLayer, filter })
          }
        }

        const data: DataviewFeature = {
          sourceId,
          dataviewsId,
          state,
          features,
          chunksFeatures,
          metadata,
        }
        return data
      }
    )
    return dataviewsFeature
    // Runs only when source tiles load change or metadata changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, sourceTilesLoaded, dataviewsMetadata, queryCacheKey])

  return dataviewFeatures
}
