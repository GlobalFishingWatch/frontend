import { useEffect, useMemo } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { Feature } from '@globalfishingwatch/maplibre-gl'
import {
  ExtendedStyle,
  HeatmapLayerMeta,
  TEMPORALGRID_SOURCE_LAYER_INTERACTIVE,
} from '@globalfishingwatch/layer-composer'
import {
  MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components'
import useMapInstance from 'features/map/map-context.hooks'
import { useMapStyle } from 'features/map/map-style.hooks'
import { mapTilesAtom } from 'features/map/map-sources.atom'
import { getSourceMetadata } from 'features/map/map-sources.utils'
import { filterByViewport } from 'features/map/map.utils'

type SourcesHookInput = string | string[]

const sourcesToArray = (sourcesIds: SourcesHookInput) =>
  Array.isArray(sourcesIds) ? sourcesIds : [sourcesIds]

const getSourcesFromMergedGenerator = (style: ExtendedStyle) => {
  const meta = getSourceMetadata(style, MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID)
  return meta.timeChunks.activeSourceId
}

const getGeneratorSourcesIds = (style: ExtendedStyle, sourcesIds: SourcesHookInput) => {
  const sourcesIdsList = sourcesToArray(sourcesIds)
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

    const onSourceDataLoading = (e: any) => {
      const { sourceId } = e
      if (sourceId) {
        setSourceTilesLoaded((state) => ({ ...state, [sourceId]: false }))
      }
    }

    const onSourceTilesLoaded = (e: any) => {
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

export type DataviewFeature = {
  sourceId: string
  dataviewId: string
  loaded: boolean
  features: Feature[]
  metadata: HeatmapLayerMeta
}
export const useMapDataviewFeatures = (
  dataviews: UrlDataviewInstance[],
  bounds?: MiniglobeBounds
) => {
  const style = useMapStyle()
  const map = useMapInstance()
  const sourceTilesLoaded = useMapSourceTiles()

  const dataviewMetadata = useMemo(
    () =>
      dataviews.map((dataview) => {
        const dataviewSource =
          dataview.category === 'fishing' || dataview.category === 'presence'
            ? MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID
            : dataview.id
        const metadata = getSourceMetadata(style, dataviewSource)
        return {
          dataviewId: dataview.id,
          metadata: metadata,
        }
      }),
    [dataviews, style]
  )

  const dataviewFeatures = useMemo(() => {
    const dataviewFeature = dataviewMetadata.map(({ dataviewId, metadata }) => {
      const sourceId = metadata?.timeChunks?.activeSourceId
      const loaded = sourceTilesLoaded[sourceId]
      const features = loaded
        ? map.querySourceFeatures(sourceId, {
            sourceLayer: TEMPORALGRID_SOURCE_LAYER_INTERACTIVE,
          })
        : null
      const data = {
        sourceId,
        dataviewId,
        loaded,
        features: bounds && features ? filterByViewport(features, bounds) : features,
        metadata,
      }
      return data
    })
    return dataviewFeature
  }, [bounds, dataviewMetadata, map, sourceTilesLoaded])

  return dataviewFeatures
}
