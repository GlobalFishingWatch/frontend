import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { PathStyleExtension } from '@deck.gl/extensions'
import { GeoJsonLayer } from '@deck.gl/layers'
import type { FeatureCollection } from 'geojson'
import { atom, useAtom } from 'jotai'

import { DatasetStatus } from '@globalfishingwatch/api-types'
import { LayerGroup } from '@globalfishingwatch/deck-layers/config'
import { getLayerGroupOffset, hexToDeckColor } from '@globalfishingwatch/deck-layers/utils'

import { useAutoRefreshImportingDataset } from 'features/_map/datasets/datasets.hook'
import { selectDatasetById } from 'features/_map/datasets/datasets.slice'
import { selectDataviewInstancesResolvedVisible } from 'features/_map/dataviews/selectors/dataviews.instances.selectors'

import { PENDING_DRAW_LAYER_ID } from '../../map.config'

const DEFAULT_PENDING_COLOR = '#ffffff'
const PENDING_REFRESH_TIMEOUT = 5000

export type PendingDrawGeometry = { datasetId: string; data: FeatureCollection }

export const pendingDrawGeometryAtom = atom<PendingDrawGeometry | null>(null)

/**
 * Keeps the geometry the user just drew on the map while the API ingests the dataset.
 * The DrawLayer is destroyed as soon as the dialog closes, and the user context layer is
 * withheld until dataset.status === 'done', so without this the geometry disappears in between.
 * Rendered non-interactive: it is a preview, not yet a pickable layer.
 */
export const usePendingDrawOverlayLayer = () => {
  const [pending, setPendingDrawGeometry] = useAtom(pendingDrawGeometryAtom)
  const datasetId = pending?.datasetId
  const dataset = useSelector(selectDatasetById(datasetId || ''))
  const dataviews = useSelector(selectDataviewInstancesResolvedVisible)

  const dataview = useMemo(() => {
    if (!datasetId) {
      return undefined
    }
    return dataviews?.find((dataview) =>
      dataview.datasetsConfig?.some((datasetConfig) => datasetConfig.datasetId === datasetId)
    )
  }, [dataviews, datasetId])

  const isImporting = dataset?.status === DatasetStatus.Importing
  // Polls without depending on UserLayerPanel being mounted or the layer being visible
  useAutoRefreshImportingDataset(isImporting ? dataset : undefined, PENDING_REFRESH_TIMEOUT)

  useEffect(() => {
    // Ingestion finished or errored. A missing dataview only hides the overlay (the layer is
    // hidden or removed) and never clears here, as on create it lands in the workspace
    // asynchronously and would race this effect.
    if (pending && !isImporting) {
      setPendingDrawGeometry(null)
    }
  }, [pending, isImporting, setPendingDrawGeometry])

  return useMemo(() => {
    if (!pending || !isImporting || !dataview) {
      return null
    }
    const color = (dataview.config?.color as string) || DEFAULT_PENDING_COLOR
    return new GeoJsonLayer({
      id: PENDING_DRAW_LAYER_ID,
      data: pending.data,
      pickable: false,
      filled: false,
      stroked: true,
      getLineColor: hexToDeckColor(color),
      getLineWidth: 2,
      lineWidthUnits: 'pixels',
      lineJointRounded: true,
      lineCapRounded: true,
      extensions: [new PathStyleExtension({ dash: true, highPrecisionDash: true })],
      getDashArray: [6, 4],
      pointType: 'circle',
      getPointRadius: 8,
      pointRadiusUnits: 'pixels',
      getPolygonOffset: (params: { layerIndex: number }) =>
        getLayerGroupOffset(LayerGroup.OutlinePolygons, params),
    })
  }, [pending, isImporting, dataview])
}
