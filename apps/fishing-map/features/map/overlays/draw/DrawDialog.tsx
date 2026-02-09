import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import bbox from '@turf/bbox'
import cx from 'classnames'
import type { Feature, Polygon } from 'geojson'

import type { DrawFeatureType } from '@globalfishingwatch/deck-layers'
import { Button, IconButton, InputText, SwitchRow } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import type { DrawnDatasetGeometry } from 'features/areas/areas.slice'
import {
  fetchDatasetAreasThunk,
  resetAreaList,
  selectDatasetAreasById,
} from 'features/areas/areas.slice'
import {
  useAddDataviewFromDatasetToWorkspace,
  useDatasetsAPI,
} from 'features/datasets/datasets.hook'
import { selectDrawEditDataset } from 'features/map/map.selectors'
import { useMapFitBounds } from 'features/map/map-bounds.hooks'
import { selectMapDrawingEditId, selectMapDrawingMode } from 'routes/routes.selectors'
import type { Bbox } from 'types'
import { AsyncReducerStatus } from 'utils/async-slice'

import { useMapDrawConnect } from '../../map-draw.hooks'

import { useDrawLayerInstance } from './draw.hooks'
import { getDrawDatasetDefinition, getFileWithFeatures } from './draw.utils'

import { replaceQueryParams } from 'routes/routes.actions'
import styles from './DrawDialog.module.css'

type DrawFeature = Feature<Polygon, { id: string; gfw_id: number; draw_id: number }>
const MIN_DATASET_NAME_LENGTH = 3

function MapDraw() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const fitMapBounds = useMapFitBounds()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [layerName, setLayerName] = useState<string>('')
  const [createAsPublic, setCreateAsPublic] = useState<boolean>(true)
  const { isMapDrawing, dispatchResetMapDraw } = useMapDrawConnect()
  const { dispatchUpsertDataset } = useDatasetsAPI()
  const { addDataviewFromDatasetToWorkspace } = useAddDataviewFromDatasetToWorkspace()
  const mapDrawingMode = useSelector(selectMapDrawingMode)
  const mapDrawEditDatasetId = useSelector(selectMapDrawingEditId)
  const mapDrawEditDataset = useSelector(selectDrawEditDataset)
  const mapDrawEditGeometry = useSelector(selectDatasetAreasById(mapDrawEditDataset?.id || ''))
  const drawLayer = useDrawLayerInstance()
  const drawFeatures = drawLayer?.getData()
  const isDrawing = (drawLayer?.getClickSequence() ?? 0) > 0
  const drawFeaturesIndexes = drawLayer?.getSelectedFeatureIndexes() || []
  const hasOverlappingFeatures = drawLayer?.getHasOverlappingFeatures()

  const fetchDrawArea = useCallback(
    async (datasetId: string) => {
      const fetchDatasetAreasAction = await dispatch(fetchDatasetAreasThunk({ datasetId }))
      if (fetchDatasetAreasThunk.fulfilled.match(fetchDatasetAreasAction)) {
        const areaBbox = bbox(fetchDatasetAreasAction.payload as DrawnDatasetGeometry) as Bbox
        if (areaBbox) {
          fitMapBounds(areaBbox, { padding: 150, fitZoom: true })
        }
      }
    },
    [dispatch, fitMapBounds]
  )

  useEffect(() => {
    if (mapDrawEditDataset) {
      setLayerName(mapDrawEditDataset.name)
      fetchDrawArea(mapDrawEditDataset.id)
    }
  }, [dispatch, fetchDrawArea, mapDrawEditDataset])

  useEffect(() => {
    if (
      drawLayer &&
      mapDrawEditDataset &&
      mapDrawEditGeometry?.status === AsyncReducerStatus.Finished
    ) {
      drawLayer.setData(mapDrawEditGeometry?.data as any)
      drawLayer.setMode('modify')
    }
  }, [
    dispatch,
    drawLayer,
    mapDrawEditDataset,
    mapDrawEditGeometry?.data,
    mapDrawEditGeometry?.status,
  ])

  const onInputChange = useCallback(
    (e: any) => {
      setLayerName(e.target.value)
    },
    [setLayerName]
  )

  const resetState = useCallback(() => {
    setLayerName('')
  }, [])

  const closeDraw = useCallback(() => {
    if (drawLayer) {
      drawLayer.reset()
    }
    resetState()
    dispatch(resetAreaList({ datasetId: mapDrawEditDatasetId }))
    dispatchResetMapDraw()
    replaceQueryParams({ sidebarOpen: true })
    trackEvent({
      category: TrackCategory.ReferenceLayer,
      action: `Draw a custom reference layer - Click dismiss`,
    })
  }, [dispatch, dispatchResetMapDraw, drawLayer, mapDrawEditDatasetId, resetState])

  const toggleCreateAsPublic = useCallback(() => {
    setCreateAsPublic((createAsPublic) => !createAsPublic)
  }, [])

  const createDataset = useCallback(
    async (features: DrawFeature[], name: string) => {
      if (features && features.length > 0) {
        setLoading(true)
        const { payload, error } = await dispatchUpsertDataset({
          dataset: {
            id: mapDrawEditDatasetId,
            ...getDrawDatasetDefinition(name, mapDrawingMode as DrawFeatureType),
          },
          file: getFileWithFeatures(name, features),
          createAsPublic,
        })
        if (error) {
          console.warn(error)
          setError('There was an error uploading the dataset')
        } else if (payload) {
          if (!mapDrawEditDatasetId) {
            addDataviewFromDatasetToWorkspace(payload)
          }
          closeDraw()
        }
        setLoading(false)
      }
    },
    [
      addDataviewFromDatasetToWorkspace,
      closeDraw,
      createAsPublic,
      dispatchUpsertDataset,
      mapDrawEditDatasetId,
      mapDrawingMode,
    ]
  )

  const onSaveClick = useCallback(
    (featureCollection: any) => {
      if (featureCollection.features && featureCollection.features.length > 0 && layerName) {
        createDataset(featureCollection.features, layerName)
        trackEvent({
          category: TrackCategory.ReferenceLayer,
          action: `Draw a custom reference layer - Click save`,
        })
      }
    },
    [createDataset, layerName]
  )

  const onAddPolygonClick = useCallback(() => {
    drawLayer?.setMode('draw')
    trackEvent({
      category: TrackCategory.ReferenceLayer,
      action: `Draw a custom reference layer - Click + icon`,
    })
  }, [drawLayer])

  const hasFeaturesDrawn = drawFeatures?.features && drawFeatures?.features?.length > 0
  const layerNameMinLength = layerName.length >= MIN_DATASET_NAME_LENGTH
  let saveTooltip = ''

  if (!layerName) {
    saveTooltip = t((t) => t.layer.nameRequired)
  } else if (!layerNameMinLength) {
    saveTooltip = t((t) => t.layer.nameLengthError, {
      count: MIN_DATASET_NAME_LENGTH,
    })
  } else if (hasOverlappingFeatures) {
    saveTooltip = t((t) => t.layer.geometryError)
  }

  let placeholderMessage: string = ''

  switch (true) {
    case !!error:
      placeholderMessage = error
      break
    case hasOverlappingFeatures:
      placeholderMessage = t((t) => t.layer.geometryError)
      break
    case hasFeaturesDrawn:
      placeholderMessage =
        mapDrawingMode === 'points'
          ? t((t) => t.layer.editPointHint)
          : t((t) => t.layer.editPolygonHint)
      break
    case isDrawing && mapDrawingMode === 'polygons':
      placeholderMessage = t((t) => t.layer.closePolygonHint, {
        defaultValue: 'Press enter or click the first point to close the polygon',
      })
      break
    default:
      placeholderMessage = t((t) => t.layer.drawHint, {
        defaultValue: 'Click on the map to start drawing',
      })
      break
  }

  return (
    <div className={cx(styles.container, { [styles.hidden]: !isMapDrawing })}>
      <div className={cx(styles.hint, { [styles.warning]: error || hasOverlappingFeatures })}>
        <IconButton
          size="small"
          className={styles.hintIcon}
          type={error || hasOverlappingFeatures ? 'warning' : 'border'}
          icon={error || hasOverlappingFeatures ? 'warning' : 'help'}
          onClick={error || hasOverlappingFeatures ? undefined : () => {}}
        />
        {placeholderMessage}
      </div>
      <InputText
        label={t((t) => t.layer.name)}
        labelClassName={styles.layerLabel}
        value={layerName}
        disabled={!!mapDrawEditDataset}
        onChange={onInputChange}
        className={styles.input}
      />
      <div className={cx(styles.flex, styles.iconsWrapper)}>
        <IconButton
          icon={mapDrawingMode === 'points' ? 'add-point' : 'add-polygon'}
          tooltip={
            mapDrawingMode === 'points'
              ? t((t) => t.layer.drawAddPoint)
              : t((t) => t.layer.drawAddPolygon)
          }
          onClick={onAddPolygonClick}
        />
        <IconButton
          type="warning"
          icon="delete"
          disabled={!drawFeaturesIndexes.length}
          tooltip={
            !drawFeaturesIndexes.length
              ? t((t) => t.layer.selectPolygonToRemove)
              : t((t) => t.layer.drawDelete)
          }
          onClick={drawLayer?.deleteSelectedFeature}
        />
      </div>
      <div className={styles.buttonsContainer}>
        <SwitchRow
          className={styles.saveAsPublic}
          label={t((t) => t.dataset.uploadPublic)}
          disabled={!!mapDrawEditDataset}
          active={createAsPublic}
          onClick={toggleCreateAsPublic}
        />
        <div className={styles.actionButtons}>
          <Button className={styles.button} type="secondary" onClick={closeDraw}>
            {t((t) => t.common.cancel)}
          </Button>
          <Button
            className={styles.button}
            loading={loading || mapDrawEditGeometry?.status === AsyncReducerStatus.Loading}
            disabled={
              !layerName ||
              !layerNameMinLength ||
              !hasFeaturesDrawn ||
              hasOverlappingFeatures ||
              mapDrawEditGeometry?.status === AsyncReducerStatus.Loading
            }
            tooltip={saveTooltip}
            tooltipPlacement="top"
            onClick={() => onSaveClick(drawFeatures)}
          >
            {t((t) => t.common.save)}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MapDraw
