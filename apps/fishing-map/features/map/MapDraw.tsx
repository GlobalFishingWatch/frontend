import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react'
import cx from 'classnames'
import kinks from '@turf/kinks'
import { Editor, EditingMode, DrawPolygonMode } from 'react-map-gl-draw'
import { useTranslation } from 'react-i18next'
import { Popup } from 'react-map-gl'
import { FeatureOf, Polygon } from '@nebula.gl/edit-modes'
import { Button, InputText, IconButton, SwitchRow } from '@globalfishingwatch/ui-components'
import { useLocationConnect } from 'routes/routes.hook'
import {
  useAddDataviewFromDatasetToWorkspace,
  useDatasetsAPI,
} from 'features/datasets/datasets.hook'
import { useMapDrawConnect } from './map-draw.hooks'
import { useMapControl } from './map-context.hooks'
import styles from './MapDraw.module.css'
import {
  featureStyle,
  FeatureStyle,
  getDrawDatasetDefinition,
  getFeaturesPrecisionRounded,
  getFileWithFeatures,
  updateFeaturePointByIndex,
} from './map.draw.utils'

export type DrawFeature = FeatureOf<Polygon>
export type DrawPointPosition = [number, number]

type EditorUpdate = {
  data: DrawFeature[]
  editType: 'addFeature' | 'addPosition' | 'finishMovePosition'
  editContext: {
    editHandleIndex: number
  }[]
}

type EditorSelect = {
  mapCoords: [number, number]
  screenCoords: [number, number]
  selectedEditHandleIndex: number
  selectedFeature: DrawFeature
  selectedFeatureIndex: number
}

export const MIN_DATASET_NAME_LENGTH = 3

function MapDraw() {
  const { t } = useTranslation()
  const editorRef = useRef<any>(null)
  const [loading, setLoading] = useState(false)
  const [layerName, setLayerName] = useState<string>('')
  const [createAsPublic, setCreateAsPublic] = useState<boolean>(true)
  const [features, setFeatures] = useState<DrawFeature[] | null>(null)
  const [newPointLatitude, setNewPointLatitude] = useState<number | string | null>(null)
  const [newPointLongitude, setNewPointLongitude] = useState<number | string | null>(null)
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState<number | null>(null)
  const [selectedEditHandleIndex, setSelectedEditHandleIndex] = useState<number | null>(null)
  const { drawMode, dispatchSetDrawMode } = useMapDrawConnect()

  const { dispatchQueryParams } = useLocationConnect()
  const { containerRef } = useMapControl()
  const { dispatchCreateDataset } = useDatasetsAPI()
  const { addDataviewFromDatasetToWorkspace } = useAddDataviewFromDatasetToWorkspace()

  const hasFeatureSelected = selectedFeatureIndex !== null
  const currentFeature: DrawFeature | null =
    selectedFeatureIndex !== null && features !== null ? features?.[selectedFeatureIndex] : null
  const currentEditHandle =
    currentFeature && selectedEditHandleIndex
      ? currentFeature.geometry.coordinates?.[0]?.[selectedEditHandleIndex]
      : null

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

  const editingPointLatitude = newPointLatitude !== null ? newPointLatitude : currentEditHandle?.[1]
  const editingPointLongitude =
    newPointLongitude !== null ? newPointLongitude : currentEditHandle?.[0]

  const onConfirmNewPointPosition = useCallback(() => {
    if (features && selectedFeatureIndex !== null && selectedEditHandleIndex !== null) {
      const newPointPosition = [editingPointLongitude, editingPointLatitude] as DrawPointPosition
      const newFeatures = updateFeaturePointByIndex(
        features,
        selectedFeatureIndex,
        selectedEditHandleIndex,
        newPointPosition
      )
      setFeatures(newFeatures)
      setNewPointLatitude(null)
      setNewPointLongitude(null)
      setSelectedEditHandleIndex(null)
    }
  }, [
    features,
    selectedFeatureIndex,
    selectedEditHandleIndex,
    editingPointLatitude,
    editingPointLongitude,
  ])

  const onEditorSelect = useCallback((e: EditorSelect) => {
    setSelectedFeatureIndex(e.selectedFeatureIndex)
    setSelectedEditHandleIndex(e.selectedEditHandleIndex)
  }, [])

  const onEditorUpdate = useCallback(
    (e: EditorUpdate) => {
      setFeatures(getFeaturesPrecisionRounded(e.data))
      if (e.editType === 'addFeature') {
        dispatchSetDrawMode('edit')
      }
      if (e.editType === 'addPosition' && selectedFeatureIndex !== null) {
        const editHandleIndex = e.editContext[selectedFeatureIndex]?.editHandleIndex
        setSelectedEditHandleIndex(editHandleIndex)
      }
    },
    [dispatchSetDrawMode, selectedFeatureIndex]
  )

  const onInputChange = useCallback(
    (e) => {
      setLayerName(e.target.value)
    },
    [setLayerName]
  )

  const onAddPolygonClick = useCallback(() => {
    dispatchSetDrawMode('draw')
  }, [dispatchSetDrawMode])

  const onRemoveClick = useCallback(() => {
    if (features?.length) {
      setFeatures(features.filter((f, index) => index !== selectedFeatureIndex))
    }
  }, [features, selectedFeatureIndex])

  const resetEditHandler = useCallback(() => {
    setSelectedEditHandleIndex(null)
    setNewPointLatitude(null)
    setNewPointLongitude(null)
  }, [])

  const resetState = useCallback(() => {
    setLayerName('')
    setFeatures(null)
    setSelectedFeatureIndex(null)
    resetEditHandler()
  }, [resetEditHandler])

  const closeDraw = useCallback(() => {
    resetState()
    dispatchSetDrawMode('disabled')
    dispatchQueryParams({ sidebarOpen: true })
  }, [dispatchQueryParams, dispatchSetDrawMode, resetState])

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

  const onSaveClick = useCallback(() => {
    if (features && features.length > 0 && layerName) {
      createDataset(features, layerName)
    }
  }, [createDataset, features, layerName])

  const overLapInFeatures = useMemo(() => {
    if (!features) {
      return []
    }
    return features.map((feature) => kinks(feature.geometry).features.length > 0)
  }, [features])
  const hasOverLapInFeatures = overLapInFeatures.some(Boolean)

  const customFeatureStyle = useCallback(
    (style: FeatureStyle) => {
      if (hasOverLapInFeatures && overLapInFeatures[style.index]) {
        return {
          stroke: 'rgb(360, 62, 98)',
          strokeWidth: 2,
          fill: 'rgb(360, 62, 98)',
          fillOpacity: 0.3,
        }
      }
      return featureStyle(style)
    },
    [hasOverLapInFeatures, overLapInFeatures]
  )

  const editorMode = useMemo(() => {
    if (drawMode === 'disabled') {
      return
    }
    return drawMode === 'edit' ? new EditingMode() : new DrawPolygonMode()
  }, [drawMode])

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
      {editorMode && (
        <div
          className={cx({
            [styles.editor]: drawMode === 'edit',
            [styles.editing]: selectedFeatureIndex !== null,
          })}
        >
          <Editor
            ref={editorRef}
            clickRadius={12}
            features={features}
            mode={editorMode}
            featureStyle={customFeatureStyle}
            onUpdate={onEditorUpdate}
            onSelect={onEditorSelect}
          />
        </div>
      )}
      {editorMode && currentEditHandle && (
        <Popup
          latitude={currentEditHandle[1]}
          longitude={currentEditHandle[0]}
          closeButton={true}
          closeOnClick={true}
          onClose={resetEditHandler}
          className={cx(styles.popup)}
          captureClick
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
        </Popup>
      )}
      <div ref={containerRef} className={cx(styles.container, { [styles.hidden]: !editorMode })}>
        {(features?.length > 0 || hasOverLapInFeatures) && (
          <div className={cx(styles.hint, { [styles.warning]: hasOverLapInFeatures })}>
            <IconButton
              size="small"
              type={hasOverLapInFeatures ? 'warning' : 'border'}
              icon={hasOverLapInFeatures ? 'warning' : 'help'}
              className={styles.hintIcon}
            />
            {hasOverLapInFeatures
              ? t('layer.geometryError', 'Some polygons have self-intersections')
              : t('layer.editPolygonHint', 'Click on polygon corners to adjust their coordinates')}
          </div>
        )}
        <InputText
          label={t('layer.name', 'Layer name')}
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
            label={t('workspace.drawUploadPublic', 'Allow other users to see this layer')}
            active={createAsPublic}
            onClick={toggleCreateAsPublic}
          />
          <div className={styles.flex}>
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
              onClick={onSaveClick}
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
