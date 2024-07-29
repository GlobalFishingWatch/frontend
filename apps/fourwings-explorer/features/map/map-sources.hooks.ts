import { useEffect, useMemo } from 'react'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'
import { FilterSpecification, GeoJSONFeature, MapDataEvent } from '@globalfishingwatch/maplibre-gl'
import {
  DEFAULT_CONTEXT_SOURCE_LAYER,
  ExtendedStyle,
  HeatmapLayerMeta,
  TEMPORALGRID_SOURCE_LAYER_INTERACTIVE,
} from '@globalfishingwatch/layer-composer'
import { isMergedAnimatedGenerator } from '@globalfishingwatch/dataviews-client/resolve-dataviews-generators'
import { useMemoCompare } from '@globalfishingwatch/react-hooks'
import { TimeseriesFeatureProps } from '@globalfishingwatch/fourwings-aggregate'
import {
  LayerFeature as BaseLayerFeature,
  ChunkFeature,
  TilesSourceState,
} from '@globalfishingwatch/features-aggregate'
import useMapInstance, { useMapInstanceStyle } from 'features/map/map-context.hooks'
import { DatasetLayer } from 'features/layers/layers.hooks'

export const mapTilesAtom = atom<Record<string, TilesSourceState>>({
  key: 'mapSourceTilesState',
  default: {},
})

type SourcesHookInput = string | string[]
// TODO: move this to fork and include sourceId in the event for tiles loaded
type CustomMapDataEvent = MapDataEvent & { sourceId: string; error?: string }

export const getHeatmapSourceMetadata = (style: ExtendedStyle, id: string) => {
  return style?.metadata?.generatorsMetadata?.[id]
}

export const toArray = (elem) => (Array.isArray(elem) ? elem : [elem])

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
  const style = useMapInstanceStyle()
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
  const style = useMapInstanceStyle()
  const sourceTilesLoaded = useMapSourceTiles()
  const sourceInStyle = useSourceInStyle(sourcesId)
  const sourcesIdsList = getGeneratorSourcesIds(style, sourcesId)
  const allSourcesLoaded = sourcesIdsList.map((source) => sourceTilesLoaded[source]?.loaded)
  return sourceInStyle && allSourcesLoaded.every((loaded) => loaded)
}

export const useMapClusterTilesLoaded = () => {
  const sourceTilesLoaded = useMapSourceTiles()
  return Object.entries(sourceTilesLoaded).every(([source, state]) => state?.loaded)
}

export const useAllMapSourceTilesLoaded = () => {
  const style = useMapInstanceStyle()
  const sources = Object.keys(style?.sources || {})
  const sourceTilesLoaded = useMapSourceTiles()
  const allSourcesLoaded = sources.every((source) => sourceTilesLoaded[source]?.loaded === true)
  return allSourcesLoaded
}

type LayerMetadata = {
  metadata: HeatmapLayerMeta
  sourcesId: string[]
  generatorSourceId: string
  layerId: string
  filter?: FilterSpecification
}

export type LayerFeature = BaseLayerFeature & {
  layerId: string
}

export const areLayersFeatureLoaded = (layers: LayerFeature | LayerFeature[]) => {
  const layersArray: LayerFeature[] = toArray(layers)
  return layersArray.length ? layersArray.every(({ state }) => state?.loaded) : false
}

export const haslayersFeatureError = (layers: LayerFeature | LayerFeature[]) => {
  const layersArray: LayerFeature[] = toArray(layers)
  return layersArray.length ? layersArray.some(({ state }) => state?.error) : false
}

export type MapLayerFeaturesParams = {
  cacheKey?: string
  queryMethod?: 'render' | 'source'
}
export const useMapLayerFeatures = (
  layers: DatasetLayer | DatasetLayer[],
  params: MapLayerFeaturesParams = {}
) => {
  const { cacheKey = '', queryMethod = 'source' } = params
  const style = useMapInstanceStyle()
  const map = useMapInstance()

  // Memoized to avoid re-runs on style changes like hovers
  const memoizedLayers = useMemoCompare(layers)
  // TODO: review performance as chunk activeStart timebar changes forces to rerun everything here
  const generatorsMetadata = useMemoCompare(style?.metadata?.generatorsMetadata)

  const layersMetadata = useMemo(() => {
    const style = { metadata: { generatorsMetadata } } as ExtendedStyle
    const layersArray = toArray(memoizedLayers || [])
    if (!layersArray || !layersArray.length) {
      return []
    }
    const layersMetadata: LayerMetadata[] = layersArray.reduce((acc, layer) => {
      const generatorSourceId = layer.id

      const metadata =
        getHeatmapSourceMetadata(style, generatorSourceId) ||
        ({ sourceLayer: DEFAULT_CONTEXT_SOURCE_LAYER } as HeatmapLayerMeta)

      const sourcesId =
        metadata?.timeChunks?.chunks.flatMap(({ sourceId }) => sourceId) || layer?.id
      return acc.concat({
        metadata,
        sourcesId,
        generatorSourceId,
        layerId: layer.id,
        filter: layer.filter,
      })
    }, [] as LayerMetadata[])
    return layersMetadata
  }, [memoizedLayers, generatorsMetadata])

  const sourcesIds = layersMetadata.flatMap(({ sourcesId }) => sourcesId)
  const sourceTilesLoaded = useMapSourceTiles(sourcesIds)

  const layerFeatures = useMemo(() => {
    const layerFeature = layersMetadata.map(({ layerId, metadata, filter }) => {
      const sourceLayer = metadata?.sourceLayer || TEMPORALGRID_SOURCE_LAYER_INTERACTIVE
      const chunks = metadata?.timeChunks?.chunks.map(({ active, sourceId, quantizeOffset }) => ({
        active,
        sourceId,
        quantizeOffset,
      }))
      const chunksFeatures: ChunkFeature[] | null = chunks
        ? chunks.map(({ active, sourceId, quantizeOffset }) => {
            const emptyChunkState = {} as TilesSourceState
            const chunkState = sourceTilesLoaded[sourceId] || emptyChunkState
            let features = null
            if (chunkState.loaded && !chunkState.error) {
              if (queryMethod === 'render') {
                features = map.queryRenderedFeatures(undefined, { layers: [sourceLayer] })
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
        : null
      const sourceId = metadata?.timeChunks?.activeSourceId || layerId
      const state = chunks
        ? ({
            loaded: chunksFeatures.every(({ state }) => state.loaded !== false),
            error: chunksFeatures
              .filter(({ state }) => state.error)
              .map(({ state }) => state.error)
              .join(','),
          } as TilesSourceState)
        : sourceTilesLoaded[sourceId] || ({} as TilesSourceState)

      let features: GeoJSONFeature[] | null = null

      if (!chunks && state?.loaded && !state?.error) {
        if (queryMethod === 'render') {
          features = map.queryRenderedFeatures(undefined, { layers: [sourceId] })
        } else {
          features = map.querySourceFeatures(sourceId, { sourceLayer, filter })
        }
      }
      const data: LayerFeature = {
        sourceId,
        layerId,
        state,
        features,
        chunksFeatures,
        metadata,
      }
      return data
    })
    return layerFeature
    // Runs only when source tiles load change to avoid unu
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, sourceTilesLoaded, cacheKey])

  return layerFeatures
}
