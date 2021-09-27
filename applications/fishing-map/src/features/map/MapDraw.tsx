import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react'
import cx from 'classnames'
import { Editor, EditingMode, DrawPolygonMode } from 'react-map-gl-draw'
import { useTranslation } from 'react-i18next'
import { Popup } from 'react-map-gl'
import { FeatureOf, Polygon } from '@nebula.gl/edit-modes'
import Button from '@globalfishingwatch/ui-components/dist/button'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import {
  useAddDataviewFromDatasetToWorkspace,
  useDatasetsAPI,
} from 'features/datasets/datasets.hook'
import { useMapDrawConnect } from './map-draw.hooks'
import { useMapControl } from './map-context.hooks'
import styles from './MapDraw.module.css'
import {
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

function MapDraw() {
  const { t } = useTranslation()
  const editorRef = useRef<any>(null)
  const [loading, setLoading] = useState(false)
  const [layerName, setLayerName] = useState<string>('')
  const [features, setFeatures] = useState<DrawFeature[] | undefined>()
  const [newPointLatitude, setNewPointLatitude] = useState<number | undefined>()
  const [newPointLongitude, setNewPointLongitude] = useState<number | undefined>()
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState<number | null>(null)
  const [selectedEditHandleIndex, setSelectedEditHandleIndex] = useState<number | null>(null)
  const { drawMode, dispatchSetDrawMode } = useMapDrawConnect()
  const { containerRef } = useMapControl()
  const { dispatchCreateDataset } = useDatasetsAPI()
  const { addDataviewFromDatasetToWorkspace } = useAddDataviewFromDatasetToWorkspace()

  const hasFeatureSelected = selectedFeatureIndex !== null
  const currentFeature: DrawFeature | null =
    selectedFeatureIndex !== null && features !== undefined
      ? features?.[selectedFeatureIndex]
      : null
  const currentEditHandle =
    currentFeature && selectedEditHandleIndex
      ? currentFeature.geometry.coordinates?.[0]?.[selectedEditHandleIndex]
      : null

  const onHandleLatitudeChange = useCallback((e) => {
    const latitude = parseFloat(e.target.value)
    if (latitude > -90 && latitude < 90) {
      setNewPointLatitude(latitude)
    }
  }, [])

  const onHandleLongitudeChange = useCallback((e) => {
    const longitude = parseFloat(e.target.value)
    if (longitude > -90 && longitude < 90) {
      setNewPointLongitude(longitude)
    }
  }, [])

  const onConfirmNewPointPosition = useCallback(() => {
    if (features && selectedFeatureIndex !== null && selectedEditHandleIndex !== null) {
      const newPointPosition = [
        newPointLongitude || currentEditHandle?.[0],
        newPointLatitude || currentEditHandle?.[1],
      ] as DrawPointPosition
      const newFeatures = updateFeaturePointByIndex(
        features,
        selectedFeatureIndex,
        selectedEditHandleIndex,
        newPointPosition
      )
      setFeatures(newFeatures)
      setNewPointLatitude(undefined)
      setNewPointLongitude(undefined)
      setSelectedEditHandleIndex(null)
    }
  }, [
    features,
    newPointLatitude,
    newPointLongitude,
    currentEditHandle,
    selectedEditHandleIndex,
    selectedFeatureIndex,
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

  const resetState = useCallback(() => {
    setLayerName('')
    setFeatures(undefined)
    setSelectedFeatureIndex(null)
    setSelectedEditHandleIndex(null)
    setNewPointLatitude(undefined)
    setNewPointLongitude(undefined)
  }, [])

  const closeDraw = useCallback(() => {
    resetState()
    dispatchSetDrawMode('disabled')
  }, [dispatchSetDrawMode, resetState])

  const createDataset = useCallback(
    async (features: DrawFeature[], name) => {
      if (features && features.length > 0) {
        setLoading(true)
        const { payload, error } = await dispatchCreateDataset({
          dataset: getDrawDatasetDefinition(name),
          file: getFileWithFeatures(name, features),
          createAsPublic: true,
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
    [addDataviewFromDatasetToWorkspace, closeDraw, dispatchCreateDataset]
  )

  const onSaveClick = useCallback(() => {
    if (features && features.length > 0 && layerName) {
      createDataset(features, layerName)
    }
  }, [createDataset, features, layerName])

  const editorMode = useMemo(() => {
    if (drawMode === 'disabled') {
      return
    }
    return drawMode === 'edit' ? new EditingMode() : new DrawPolygonMode()
  }, [drawMode])

  const hasFeaturesDrawn = features !== undefined && features.length > 0
  let saveTooltip = ''

  if (!layerName) {
    saveTooltip = t('layer.nameRequired', 'Layer name is required')
  } else if (!hasFeaturesDrawn) {
    saveTooltip = t('layer.geometryRequired', 'Draw a polygon is required')
  }

  return (
    <Fragment>
      {editorMode && (
        <Editor
          ref={editorRef}
          clickRadius={12}
          features={features}
          mode={editorMode}
          onUpdate={onEditorUpdate}
          onSelect={onEditorSelect}
        />
      )}
      {editorMode && currentEditHandle && (
        <Popup
          latitude={currentEditHandle[1]}
          longitude={currentEditHandle[0]}
          closeButton={true}
          closeOnClick={true}
          onClose={() => setSelectedEditHandleIndex(null)}
          className={cx(styles.popup)}
          captureClick
        >
          <div className={styles.popupContent}>
            <div className={styles.flex}>
              <InputText
                step="0.01"
                type="number"
                inputSize="small"
                value={newPointLatitude || currentEditHandle[1]}
                label={t('common.latitude', 'Latitude')}
                onChange={onHandleLatitudeChange}
                className={styles.shortInput}
              />
              <InputText
                step="0.01"
                type="number"
                className={styles.shortInput}
                value={newPointLongitude || currentEditHandle[0]}
                label={t('common.longitude', 'longitude')}
                onChange={onHandleLongitudeChange}
                inputSize="small"
              />
            </div>
            <Button onClick={onConfirmNewPointPosition} className={styles.confirmBtn}>
              {t('common.confirm', 'Confirm')}
            </Button>
          </div>
        </Popup>
      )}
      <div ref={containerRef} className={cx(styles.container, { [styles.hidden]: !editorMode })}>
        <div>
          <label>{t('layer.name', 'Layer name')}</label>
          <div className={styles.flex}>
            <InputText
              value={layerName}
              onChange={onInputChange}
              className={styles.input}
              inputSize="small"
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
          </div>
        </div>
        <div className={styles.flex}>
          <Button className={styles.button} type="secondary" onClick={closeDraw}>
            {t('common.dismiss', 'Dismiss')}
          </Button>
          <Button
            className={styles.button}
            loading={loading}
            disabled={!layerName || !hasFeaturesDrawn}
            tooltip={saveTooltip}
            tooltipPlacement="top"
            onClick={onSaveClick}
          >
            {t('common.save', 'Save')}
          </Button>
        </div>
      </div>
    </Fragment>
  )
}

export default MapDraw
