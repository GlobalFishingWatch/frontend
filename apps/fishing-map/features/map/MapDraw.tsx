import { Fragment, useCallback, useMemo, useState } from 'react'
import cx from 'classnames'
import kinks from '@turf/kinks'
import { useTranslation } from 'react-i18next'
import { Feature, Polygon } from 'geojson'
import { DrawModes, DrawSelectionChangeEvent } from '@mapbox/mapbox-gl-draw'
import { Popup } from 'react-map-gl'
import { Button, InputText, IconButton, SwitchRow } from '@globalfishingwatch/ui-components'
import { useLocationConnect } from 'routes/routes.hook'
import {
  useAddDataviewFromDatasetToWorkspace,
  useDatasetsAPI,
} from 'features/datasets/datasets.hook'
import useDrawControl from 'features/map/MapDrawControl'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useMapDrawConnect } from './map-draw.hooks'
import styles from './MapDraw.module.css'
import {
  getCoordinatePrecisionRounded,
  getDrawDatasetDefinition,
  getFileWithFeatures,
  removeFeaturePointByIndex,
  updateFeaturePointByIndex,
} from './map.draw.utils'

export type DrawFeature = Feature<Polygon, { id: string }>
export type DrawPointPosition = [number, number]
export type DrawMode = DrawModes['DIRECT_SELECT'] | DrawModes['DRAW_POLYGON']
export const MIN_DATASET_NAME_LENGTH = 3

const getSelectedFeature = (drawControl: MapboxDraw) => {
  try {
    return drawControl.getSelected()?.features?.[0] as DrawFeature
  } catch (e) {
    return undefined
  }
}
const getAllFeatures = (drawControl: MapboxDraw) => {
  try {
    return drawControl.getAll()?.features as DrawFeature[]
  } catch (e) {
    return []
  }
}

function MapDraw() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [layerName, setLayerName] = useState<string>('')
  const [createAsPublic, setCreateAsPublic] = useState<boolean>(true)
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null)
  const [newPointLatitude, setNewPointLatitude] = useState<number | string | null>(null)
  const [newPointLongitude, setNewPointLongitude] = useState<number | string | null>(null)
  const { isMapDrawing, dispatchSetMapDrawing } = useMapDrawConnect()
  const { dispatchQueryParams } = useLocationConnect()
  const { dispatchCreateDataset } = useDatasetsAPI()
  const { addDataviewFromDatasetToWorkspace } = useAddDataviewFromDatasetToWorkspace()

  const onSelectionChange = (e: DrawSelectionChangeEvent) => {
    const feature = e.features?.[0] as DrawFeature
    if (feature) {
      const currentPoint = e.points?.[0]
      if (currentPoint) {
        const pointIndex = feature.geometry.coordinates[0].findIndex(
          ([lng, lat]) =>
            currentPoint.geometry.coordinates[0] === lng &&
            currentPoint.geometry.coordinates[1] === lat
        )
        setSelectedPointIndex(pointIndex > -1 ? pointIndex : null)
      }
    }
  }

  const drawControl = useDrawControl({
    displayControlsDefault: false,
    defaultMode: 'draw_polygon',
    onSelectionChange: onSelectionChange,
  })

  const features = getAllFeatures(drawControl)
  const selectedFeature = getSelectedFeature(drawControl)
  const selectedFeatureId = selectedFeature?.id as string

  const hasFeatureSelected = selectedFeature !== undefined
  const currentPointCoordinates =
    selectedFeature && selectedPointIndex !== null
      ? getCoordinatePrecisionRounded(
          selectedFeature.geometry.coordinates?.[0]?.[selectedPointIndex]
        )
      : null
  const allowDeletePoint = selectedFeature!?.geometry!?.coordinates!?.[0]!?.length > 4

  const onHandleLatitudeChange = useCallback((e) => {
    if (e.target.value) {
      const latitude = parseFloat(e.target.value)
      if (latitude > -90 && latitude < 90) {
        setNewPointLatitude(latitude)
      }
    } else {
      setNewPointLatitude('')
    }
  }, [])

  const onHandleLongitudeChange = useCallback((e) => {
    if (e.target.value) {
      const longitude = parseFloat(e.target.value)
      if (longitude > -180 && longitude < 180) {
        setNewPointLongitude(longitude)
      }
    } else {
      setNewPointLongitude('')
    }
  }, [])

  const editingPointLatitude =
    newPointLatitude !== null ? newPointLatitude : currentPointCoordinates?.[1]
  const editingPointLongitude =
    newPointLongitude !== null ? newPointLongitude : currentPointCoordinates?.[0]

  const onConfirmNewPointPosition = useCallback(() => {
    if (selectedFeature !== null && selectedFeature !== undefined && selectedPointIndex !== null) {
      const newPointPosition = [editingPointLongitude, editingPointLatitude] as DrawPointPosition
      const newFeature = updateFeaturePointByIndex(
        selectedFeature,
        selectedPointIndex,
        newPointPosition
      )
      // From DOCS: If you add() a feature with an id that is already in use,
      // the existing feature will be updated and no new feature will be added.
      drawControl.add(newFeature)
      setNewPointLatitude(null)
      setNewPointLongitude(null)
      setSelectedPointIndex(null)
    }
  }, [
    selectedFeature,
    selectedPointIndex,
    editingPointLongitude,
    editingPointLatitude,
    drawControl,
  ])

  const onDeletePoint = useCallback(() => {
    if (selectedFeature !== null && selectedFeature !== undefined && selectedPointIndex !== null) {
      const newFeature = removeFeaturePointByIndex(selectedFeature, selectedPointIndex)
      drawControl.add(newFeature)
      setSelectedPointIndex(null)
    }
  }, [drawControl, selectedFeature, selectedPointIndex])

  const onInputChange = useCallback(
    (e) => {
      setLayerName(e.target.value)
    },
    [setLayerName]
  )

  const setDrawingMode = useCallback(
    (mode: DrawMode, featureId?: string) => {
      const modeOptions = featureId ? { featureId } : ({} as any)
      drawControl.changeMode(mode as any, modeOptions)
    },
    [drawControl]
  )

  const onHintClick = useCallback(() => {
    if (features.length) {
      const selectedFeature = features[0]
      setDrawingMode('direct_select', selectedFeature.id as string)
      setSelectedPointIndex(1)
    }
  }, [features, setDrawingMode])

  const onAddPolygonClick = useCallback(() => {
    setDrawingMode('draw_polygon')
    trackEvent({
      category: TrackCategory.ReferenceLayer,
      action: `Draw a custom reference layer - Click + icon`,
    })
  }, [setDrawingMode])

  const onRemoveClick = useCallback(() => {
    drawControl.delete(selectedFeatureId as string)
  }, [drawControl, selectedFeatureId])

  const resetEditHandler = useCallback(() => {
    setSelectedPointIndex(null)
    setNewPointLatitude(null)
    setNewPointLongitude(null)
  }, [])

  const resetState = useCallback(() => {
    setLayerName('')
    resetEditHandler()
  }, [resetEditHandler])

  const closeDraw = useCallback(() => {
    resetState()
    dispatchSetMapDrawing(false)
    dispatchQueryParams({ sidebarOpen: true })
    trackEvent({
      category: TrackCategory.ReferenceLayer,
      action: `Draw a custom reference layer - Click dismiss`,
    })
  }, [dispatchQueryParams, dispatchSetMapDrawing, resetState])

  const toggleCreateAsPublic = useCallback(() => {
    setCreateAsPublic((createAsPublic) => !createAsPublic)
  }, [])

  const createDataset = useCallback(
    async (features: DrawFeature[], name) => {
      if (features && features.length > 0) {
        setLoading(true)
        const { payload, error } = await dispatchCreateDataset({
          dataset: getDrawDatasetDefinition(name),
          file: getFileWithFeatures(name, features),
          createAsPublic,
        })
        if (error) {
          console.warn(error)
        } else if (payload) {
          addDataviewFromDatasetToWorkspace(payload)
        }
        setLoading(false)
        closeDraw()
      }
    },
    [addDataviewFromDatasetToWorkspace, closeDraw, createAsPublic, dispatchCreateDataset]
  )

  const onSaveClick = useCallback(
    (features) => {
      if (features && features.length > 0 && layerName) {
        createDataset(features, layerName)
        trackEvent({
          category: TrackCategory.ReferenceLayer,
          action: `Draw a custom reference layer - Click save`,
        })
      }
    },
    [createDataset, layerName]
  )

  const overLapInFeatures = useMemo(() => {
    if (features?.length) {
      return features.map((feature) => kinks(feature.geometry).features.length > 0)
    }
    return []
  }, [features])

  const hasOverLapInFeatures = overLapInFeatures.some(Boolean)
  const hasFeaturesDrawn = features !== null && features.length > 0
  const layerNameMinLength = layerName.length >= MIN_DATASET_NAME_LENGTH
  let saveTooltip = ''

  if (!layerName) {
    saveTooltip = t('layer.nameRequired', 'Layer name is required')
  } else if (!layerNameMinLength) {
    saveTooltip = t('layer.nameLengthError', 'Layer name requires at least {{count}} characters', {
      count: MIN_DATASET_NAME_LENGTH,
    })
  } else if (!hasFeaturesDrawn) {
    saveTooltip = t('layer.geometryRequired', 'Draw a polygon is required')
  } else if (hasOverLapInFeatures) {
    saveTooltip = t('layer.geometryError', 'Some polygons have self-intersections')
  }

  return (
    <Fragment>
      {isMapDrawing && currentPointCoordinates && (
        <Popup
          latitude={currentPointCoordinates[1]}
          longitude={currentPointCoordinates[0]}
          closeButton={true}
          closeOnClick={false}
          onClose={resetEditHandler}
          maxWidth="320px"
          className={cx(styles.popup)}
        >
          <div className={styles.popupContent}>
            <div className={styles.flex}>
              <InputText
                step="0.01"
                type="number"
                inputSize="small"
                value={editingPointLatitude}
                label={t('common.latitude', 'Latitude')}
                onChange={onHandleLatitudeChange}
                className={styles.shortInput}
              />
              <InputText
                step="0.01"
                type="number"
                className={styles.shortInput}
                value={editingPointLongitude}
                label={t('common.longitude', 'longitude')}
                onChange={onHandleLongitudeChange}
                inputSize="small"
              />
            </div>
            <div className={styles.popupButtons}>
              <IconButton
                icon="delete"
                type="warning-border"
                onClick={onDeletePoint}
                disabled={!allowDeletePoint}
                tooltip={
                  allowDeletePoint
                    ? t('layer.removePoint', 'Remove point')
                    : t('layer.removePointNotAllowed', 'Geometry needs at least 3 points')
                }
              />
              <Button
                disabled={
                  editingPointLatitude === null ||
                  editingPointLatitude === '' ||
                  editingPointLongitude === null ||
                  editingPointLongitude === ''
                }
                onClick={onConfirmNewPointPosition}
                className={styles.confirmBtn}
              >
                {t('common.confirm', 'Confirm')}
              </Button>
            </div>
          </div>
        </Popup>
      )}
      <div className={cx(styles.container, { [styles.hidden]: !isMapDrawing })}>
        {(features?.length > 0 || hasOverLapInFeatures) && (
          <div className={cx(styles.hint, { [styles.warning]: hasOverLapInFeatures })}>
            <IconButton
              size="small"
              type={hasOverLapInFeatures ? 'warning' : 'border'}
              icon={hasOverLapInFeatures ? 'warning' : 'help'}
              className={styles.hintIcon}
              onClick={hasOverLapInFeatures ? undefined : onHintClick}
            />
            {hasOverLapInFeatures
              ? t('layer.geometryError', 'Some polygons have self-intersections')
              : t('layer.editPolygonHint', 'Click on polygon corners to adjust their coordinates')}
          </div>
        )}
        <InputText
          label={t('layer.name', 'Layer name')}
          labelClassName={styles.layerLabel}
          value={layerName}
          onChange={onInputChange}
          className={styles.input}
        />
        <IconButton icon="add-polygon" onClick={onAddPolygonClick} />
        <IconButton
          type="warning"
          icon="delete"
          disabled={!hasFeatureSelected}
          tooltip={
            !hasFeatureSelected
              ? t('layer.selectPolygonToRemove', 'Select the polygon to remove')
              : ''
          }
          onClick={onRemoveClick}
        />
        <div className={styles.buttonsContainer}>
          <SwitchRow
            className={styles.saveAsPublic}
            label={t(
              'dataset.uploadPublic',
              'Allow other users to see this dataset when you share a workspace'
            )}
            active={createAsPublic}
            onClick={toggleCreateAsPublic}
          />
          <div className={styles.actionButtons}>
            <Button className={styles.button} type="secondary" onClick={closeDraw}>
              {t('common.dismiss', 'Dismiss')}
            </Button>
            <Button
              className={styles.button}
              loading={loading}
              disabled={
                !layerName || !layerNameMinLength || !hasFeaturesDrawn || hasOverLapInFeatures
              }
              tooltip={saveTooltip}
              tooltipPlacement="top"
              onClick={() => onSaveClick(features)}
            >
              {t('common.save', 'Save')}
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default MapDraw
