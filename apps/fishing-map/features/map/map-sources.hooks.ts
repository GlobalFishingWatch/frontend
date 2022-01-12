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
  MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { TimeseriesFeatureProps } from '@globalfishingwatch/fourwings-aggregate'
import useMapInstance from 'features/map/map-context.hooks'
import { useMapStyle } from 'features/map/map-style.hooks'
import { mapTilesAtom } from 'features/map/map-sources.atom'
import { getHeatmapSourceMetadata } from 'features/map/map-sources.utils'

type SourcesHookInput = string | string[]
// TODO: move this to fork and include sourceId in the event for tiles loaded
type CustomMapDataEvent = MapDataEvent & { sourceId: string }

const toArray = <S = SourcesHookInput>(elem: S) => (Array.isArray(elem) ? elem : [elem])

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
        setSourceTilesLoaded((state) => ({ ...state, [sourceId]: false }))
      }
    }

    const onSourceTilesLoaded = (e: CustomMapDataEvent) => {
      const { sourceId } = e
      if (sourceId) {
        setSourceTilesLoaded((state) => ({ ...state, [sourceId]: true }))
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
  return sourceInStyle && sourcesIdsList.every((source) => sourceTilesLoaded[source])
}

export type DataviewChunkFeature = {
  loaded: boolean
  features: GeoJSONFeature<TimeseriesFeatureProps>[]
  quantizeOffset: number
}
export type DataviewFeature = {
  loaded: boolean
  sourceId: string
  dataviewId: string
  features: GeoJSONFeature[]
  chunksFeatures: DataviewChunkFeature[]
  metadata: HeatmapLayerMeta
}

export const getDataviewsFeatureLoaded = (dataviews: DataviewFeature | DataviewFeature[]) => {
  const dataviewsArray = toArray(dataviews)
  return dataviewsArray.every(({ loaded, chunksFeatures }) =>
    chunksFeatures ? chunksFeatures.every(({ loaded }) => loaded) : loaded
  )
}

export const useMapDataviewFeatures = (dataviews: UrlDataviewInstance | UrlDataviewInstance[]) => {
  const style = useMapStyle()
  const map = useMapInstance()
  const sourceTilesLoaded = useMapSourceTiles()
  // Memoized to avoid re-runs on style changes like hovers
  const styleMetadata = useMemo(() => style?.metadata, [style])

  const dataviewMetadata = useMemo(() => {
    const dataviewsArray = toArray(dataviews)
    return dataviewsArray.map((dataview) => {
      const dataviewSource =
        dataview.category === 'fishing' || dataview.category === 'presence'
          ? MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID
          : dataview.id
      const metadata =
        getHeatmapSourceMetadata({ metadata: styleMetadata } as ExtendedStyle, dataviewSource) ||
        ({ sourceLayer: DEFAULT_CONTEXT_SOURCE_LAYER } as HeatmapLayerMeta)
      return {
        dataviewId: dataview.id,
        metadata: metadata,
        filter: dataview.config.filter,
      }
    })
  }, [dataviews, styleMetadata])

  const dataviewFeatures = useMemo(() => {
    const dataviewFeature = dataviewMetadata.map(({ dataviewId, metadata, filter }) => {
      const sourceLayer = metadata?.sourceLayer || TEMPORALGRID_SOURCE_LAYER_INTERACTIVE
      const sourceId = metadata?.timeChunks?.activeSourceId || dataviewId
      const chunks = metadata?.timeChunks?.chunks.map(({ sourceId, quantizeOffset }) => ({
        sourceId,
        quantizeOffset,
      }))

      const chunksFeatures: DataviewChunkFeature[] | null = chunks
        ? chunks.map(({ sourceId, quantizeOffset }) => {
            const chunkLoaded = sourceTilesLoaded[sourceId]
            return {
              features: chunkLoaded
                ? map.querySourceFeatures(sourceId, { sourceLayer, filter })
                : null,
              quantizeOffset,
              loaded: chunkLoaded,
            }
          })
        : null

      const loaded = chunks
        ? chunksFeatures.every(({ loaded }) => loaded)
        : sourceTilesLoaded[sourceId]

      const features: GeoJSONFeature[] | null =
        !chunks && loaded ? map.querySourceFeatures(sourceId, { sourceLayer, filter }) : null

      const data = {
        sourceId,
        dataviewId,
        loaded,
        features,
        chunksFeatures,
        metadata,
      }
      return data
    })
    return dataviewFeature
  }, [dataviewMetadata, map, sourceTilesLoaded])

  return dataviewFeatures
}
