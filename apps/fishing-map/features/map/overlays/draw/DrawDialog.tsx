import { Fragment, useCallback, useEffect, useState } from 'react'
import { atom, useRecoilState } from 'recoil'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { Feature, Polygon } from 'geojson'
import { DrawModes, DrawSelectionChangeEvent } from '@mapbox/mapbox-gl-draw'
import { useSelector } from 'react-redux'
import { Button, InputText, IconButton, SwitchRow } from '@globalfishingwatch/ui-components'
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
import { selectMapDrawingEditId } from 'routes/routes.selectors'
import { useMapDrawConnect } from '../../map-draw.hooks'
import {
  getCoordinatePrecisionRounded,
  getDrawDatasetDefinition,
  getFileWithFeatures,
  removeFeaturePointByIndex,
  updateFeaturePointByIndex,
} from '../../map.draw.utils'
import styles from './DrawDialog.module.css'
import { useDrawLayer } from './draw.hooks'
import { CoordinateEditOverlay } from './CoordinateEditOverlay'

export type DrawFeature = Feature<Polygon, { id: string; gfw_id: number; draw_id: number }>
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

const selectedPointIndexAtom = atom<number | null>({
  key: 'selectedPointIndex',
  default: null,
  effects: [],
})

function MapDraw() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [layerName, setLayerName] = useState<string>('')
  const [createAsPublic, setCreateAsPublic] = useState<boolean>(true)
  const [selectedPointIndex, setSelectedPointIndex] = useRecoilState(selectedPointIndexAtom)
  // const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null)
  const [newPointLatitude, setNewPointLatitude] = useState<number | string | null>(null)
  const [newPointLongitude, setNewPointLongitude] = useState<number | string | null>(null)
  const { isMapDrawing, dispatchResetMapDraw } = useMapDrawConnect()
  const { dispatchQueryParams } = useLocationConnect()
  const { dispatchUpsertDataset } = useDatasetsAPI()
  const { addDataviewFromDatasetToWorkspace } = useAddDataviewFromDatasetToWorkspace()
  const mapDrawEditDatasetId = useSelector(selectMapDrawingEditId)
  const mapDrawEditDataset = useSelector(selectDrawEditDataset)
  const mapDrawEditGeometry = useSelector(selectDatasetAreasById(mapDrawEditDataset?.id || ''))
  const drawLayer = useDrawLayer()
  const drawFeatures = drawLayer?.getData() || []
  const drawFeaturesIndexes = drawLayer?.getSelectedFeatureIndexes() || []
  const hasOverlappingFeatures = drawLayer?.getHasOverlappingFeatures()

  useEffect(() => {
    if (mapDrawEditDataset) {
      setLayerName(mapDrawEditDataset.name)
      dispatch(fetchDatasetAreasThunk({ datasetId: mapDrawEditDataset.id }))
    }
  }, [dispatch, mapDrawEditDataset])

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
        const selectedPointIndex = pointIndex > -1 ? pointIndex : null
        setSelectedPointIndex(selectedPointIndex)
      }
    }
  }

  // const drawControl = useDrawControl({
  //   displayControlsDefault: false,
  //   defaultMode: mapDrawEditDataset ? 'simple_select' : 'draw_polygon',
  //   onSelectionChange: onSelectionChange,
  // })

  // useEffect(() => {
  //   if (mapDrawEditGeometry?.status === AsyncReducerStatus.Finished && mapDrawEditGeometry?.data) {
  //     drawControl.add(mapDrawEditGeometry.data as any)
  //   }
  // }, [drawControl, mapDrawEditGeometry])

  // const features = getAllFeatures(drawControl)
  // const selectedFeature = getSelectedFeature(drawControl)
  // const selectedFeatureId = selectedFeature?.id as string

  // const currentPointCoordinates =
  //   selectedFeature && selectedPointIndex !== null
  //     ? getCoordinatePrecisionRounded(
  //         selectedFeature.geometry.coordinates?.[0]?.[selectedPointIndex]
  //       )
  //     : null
  // const allowDeletePoint = selectedFeature!?.geometry!?.coordinates!?.[0]!?.length > 4

  const onHandleLatitudeChange = useCallback((e: any) => {
    if (e.target.value) {
      const latitude = parseFloat(e.target.value)
      if (latitude > -90 && latitude < 90) {
        setNewPointLatitude(latitude)
      }
    } else {
      setNewPointLatitude('')
    }
  }, [])

  const onHandleLongitudeChange = useCallback((e: any) => {
    if (e.target.value) {
      const longitude = parseFloat(e.target.value)
      if (longitude > -180 && longitude < 180) {
        setNewPointLongitude(longitude)
      }
    } else {
      setNewPointLongitude('')
    }
  }, [])

  // const editingPointLatitude =
  //   newPointLatitude !== null ? newPointLatitude : currentPointCoordinates?.[1]
  // const editingPointLongitude =
  //   newPointLongitude !== null ? newPointLongitude : currentPointCoordinates?.[0]

  // const onConfirmNewPointPosition = useCallback(() => {
  //   if (selectedFeature !== null && selectedFeature !== undefined && selectedPointIndex !== null) {
  //     const newPointPosition = [editingPointLongitude, editingPointLatitude] as DrawPointPosition
  //     const newFeature = updateFeaturePointByIndex(
  //       selectedFeature,
  //       selectedPointIndex,
  //       newPointPosition
  //     )
  //     // From DOCS: If you add() a feature with an id that is already in use,
  //     // the existing feature will be updated and no new feature will be added.
  //     drawControl.add(newFeature)
  //     setNewPointLatitude(null)
  //     setNewPointLongitude(null)
  //     setSelectedPointIndex(null)
  //   }
  // }, [
  //   selectedFeature,
  //   selectedPointIndex,
  //   editingPointLongitude,
  //   editingPointLatitude,
  //   drawControl,
  //   setSelectedPointIndex,
  // ])

  // const onDeletePoint = useCallback(() => {
  //   if (selectedFeature !== null && selectedFeature !== undefined && selectedPointIndex !== null) {
  //     const newFeature = removeFeaturePointByIndex(selectedFeature, selectedPointIndex)
  //     drawControl.add(newFeature)
  //     setSelectedPointIndex(null)
  //   }
  // }, [drawControl, selectedFeature, selectedPointIndex, setSelectedPointIndex])

  const onInputChange = useCallback(
    (e: any) => {
      setLayerName(e.target.value)
    },
    [setLayerName]
  )

  // const setDrawingMode = useCallback(
  //   (mode: DrawMode, featureId?: string) => {
  //     const modeOptions = featureId ? { featureId } : ({} as any)
  //     drawControl.changeMode(mode as any, modeOptions)
  //   },
  //   [drawControl]
  // )

  // const onHintClick = useCallback(() => {
  //   if (features.length) {
  //     const selectedFeature = features[0]
  //     setDrawingMode('direct_select', selectedFeature.id as string)
  //     setSelectedPointIndex(1)
  //   }
  // }, [features, setDrawingMode, setSelectedPointIndex])

  // const onAddPolygonClick = useCallback(() => {
  //   setDrawingMode('draw_polygon')
  //   trackEvent({
  //     category: TrackCategory.ReferenceLayer,
  //     action: `Draw a custom reference layer - Click + icon`,
  //   })
  // }, [setDrawingMode])

  // const onRemoveClick = useCallback(() => {
  //   drawControl.delete(selectedFeatureId as string)
  // }, [drawControl, selectedFeatureId])

  const resetEditHandler = useCallback(() => {
    setSelectedPointIndex(null)
    setNewPointLatitude(null)
    setNewPointLongitude(null)
  }, [setSelectedPointIndex])

  const resetState = useCallback(() => {
    setLayerName('')
    resetEditHandler()
  }, [resetEditHandler])

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
    mapDrawEditDatasetId,
    // resetDrawFeatures,
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
          dataset: { id: mapDrawEditDatasetId, ...getDrawDatasetDefinition(name) },
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
  const hasFeaturesDrawn = drawFeatures.features?.length > 0
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
    <Fragment>
      <CoordinateEditOverlay />
      <div className={cx(styles.container, { [styles.hidden]: !isMapDrawing })}>
        {(drawFeatures?.features?.length > 0 || hasOverlappingFeatures) && (
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
          icon="add-polygon"
          onClick={() => {
            drawLayer?.setDrawingMode()
          }}
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
    </Fragment>
  )
}

export default MapDraw
