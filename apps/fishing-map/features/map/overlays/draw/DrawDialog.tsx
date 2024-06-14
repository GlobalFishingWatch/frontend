import { useCallback, useEffect, useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { Feature, Polygon } from 'geojson'
import { useSelector } from 'react-redux'
import { Button, InputText, IconButton, SwitchRow } from '@globalfishingwatch/ui-components'
import { DrawFeatureType } from '@globalfishingwatch/deck-layers'
import { useLocationConnect } from 'routes/routes.hook'
import {
  useAddDataviewFromDatasetToWorkspace,
  useDatasetsAPI,
} from 'features/datasets/datasets.hook'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectDrawEditDataset } from 'features/map/map.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  resetAreaList,
  fetchDatasetAreasThunk,
  selectDatasetAreasById,
} from 'features/areas/areas.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectMapDrawingEditId, selectMapDrawingMode } from 'routes/routes.selectors'
import { useMapDrawConnect } from '../../map-draw.hooks'
import { getDrawDatasetDefinition, getFileWithFeatures } from './draw.utils'
import styles from './DrawDialog.module.css'
import { useDrawLayerInstance } from './draw.hooks'

export type DrawFeature = Feature<Polygon, { id: string; gfw_id: number; draw_id: number }>
export type DrawPointPosition = [number, number]
export const MIN_DATASET_NAME_LENGTH = 3

function MapDraw() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [layerName, setLayerName] = useState<string>('')
  const [createAsPublic, setCreateAsPublic] = useState<boolean>(true)
  const { isMapDrawing, dispatchResetMapDraw } = useMapDrawConnect()
  const { dispatchQueryParams } = useLocationConnect()
  const { dispatchUpsertDataset } = useDatasetsAPI()
  const { addDataviewFromDatasetToWorkspace } = useAddDataviewFromDatasetToWorkspace()
  const mapDrawingMode = useSelector(selectMapDrawingMode)
  const mapDrawEditDatasetId = useSelector(selectMapDrawingEditId)
  const mapDrawEditDataset = useSelector(selectDrawEditDataset)
  const mapDrawEditGeometry = useSelector(selectDatasetAreasById(mapDrawEditDataset?.id || ''))
  const drawLayer = useDrawLayerInstance()
  const drawFeatures = drawLayer?.getData()
  const drawFeaturesIndexes = drawLayer?.getSelectedFeatureIndexes() || []
  const hasOverlappingFeatures = drawLayer?.getHasOverlappingFeatures()

  useEffect(() => {
    if (mapDrawEditDataset) {
      setLayerName(mapDrawEditDataset.name)
      dispatch(fetchDatasetAreasThunk({ datasetId: mapDrawEditDataset.id }))
    }
  }, [dispatch, mapDrawEditDataset])

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
    dispatchQueryParams({ sidebarOpen: true })
    trackEvent({
      category: TrackCategory.ReferenceLayer,
      action: `Draw a custom reference layer - Click dismiss`,
    })
  }, [
    dispatch,
    dispatchQueryParams,
    dispatchResetMapDraw,
    drawLayer,
    mapDrawEditDatasetId,
    resetState,
  ])

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

  const hasFeaturesDrawn = drawFeatures?.features && drawFeatures?.features?.length > 0
  const layerNameMinLength = layerName.length >= MIN_DATASET_NAME_LENGTH
  let saveTooltip = ''

  if (!layerName) {
    saveTooltip = t('layer.nameRequired', 'Layer name is required')
  } else if (!layerNameMinLength) {
    saveTooltip = t('layer.nameLengthError', 'Layer name requires at least {{count}} characters', {
      count: MIN_DATASET_NAME_LENGTH,
    })
    // } else if (!hasFeaturesDrawn) {
    //   saveTooltip = t('layer.geometryRequired', 'Draw a polygon is required')
  } else if (hasOverlappingFeatures) {
    saveTooltip = t('layer.geometryError', 'Some polygons have self-intersections')
  }

  return (
    <div className={cx(styles.container, { [styles.hidden]: !isMapDrawing })}>
      {((drawFeatures?.features && drawFeatures?.features?.length > 0) ||
        hasOverlappingFeatures) && (
        <div className={cx(styles.hint, { [styles.warning]: error || hasOverlappingFeatures })}>
          <IconButton
            size="small"
            className={styles.hintIcon}
            type={error || hasOverlappingFeatures ? 'warning' : 'border'}
            icon={error || hasOverlappingFeatures ? 'warning' : 'help'}
            onClick={error || hasOverlappingFeatures ? undefined : () => {}}
          />
          {error ? (
            <span>{error}</span>
          ) : hasOverlappingFeatures ? (
            t('layer.geometryError', 'Some polygons have self-intersections')
          ) : (
            t('layer.editPolygonHint', 'Click on polygon corners to adjust their coordinates')
          )}
        </div>
      )}
      <InputText
        label={t('layer.name', 'Layer name')}
        labelClassName={styles.layerLabel}
        value={layerName}
        disabled={!!mapDrawEditDataset}
        onChange={onInputChange}
        className={styles.input}
      />
      <IconButton
        icon={mapDrawingMode === 'points' ? 'add-point' : 'add-polygon'}
        onClick={() => drawLayer?.setMode('draw')}
      />
      <IconButton
        type="warning"
        icon="delete"
        disabled={!drawFeaturesIndexes.length}
        tooltip={
          !drawFeaturesIndexes.length
            ? t('layer.selectPolygonToRemove', 'Select the polygon to remove')
            : ''
        }
        onClick={drawLayer?.deleteSelectedFeature}
      />
      <div className={styles.buttonsContainer}>
        <SwitchRow
          className={styles.saveAsPublic}
          label={t(
            'dataset.uploadPublic',
            'Allow other users to see this dataset when you share a workspace'
          )}
          disabled={!!mapDrawEditDataset}
          active={createAsPublic}
          onClick={toggleCreateAsPublic}
        />
        <div className={styles.actionButtons}>
          <Button className={styles.button} type="secondary" onClick={closeDraw}>
            {t('common.dismiss', 'Dismiss')}
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
            {t('common.save', 'Save')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MapDraw
