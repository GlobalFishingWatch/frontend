import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react'
import cx from 'classnames'
import { Editor, EditingMode, DrawPolygonMode } from 'react-map-gl-draw'
import { useTranslation } from 'react-i18next'
import { Popup } from 'react-map-gl'
import { FeatureOf, Polygon } from '@nebula.gl/edit-modes'
import Button from '@globalfishingwatch/ui-components/dist/button'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { DatasetCategory, DatasetConfiguration, DatasetTypes } from '@globalfishingwatch/api-types'
import {
  useAddDataviewFromDatasetToWorkspace,
  useDatasetsAPI,
} from 'features/datasets/datasets.hook'
import { useMapDrawConnect } from './map-draw.hooks'
import { useMapControl } from './map-context.hooks'
import styles from './MapDraw.module.css'

type Feature = FeatureOf<Polygon>

type EditorUpdate = {
  data: Feature[]
  editType: 'addFeature' | 'addPosition' | 'finishMovePosition'
  editContext: {
    editHandleIndex: number
  }[]
}

type EditorSelect = {
  mapCoords: number[]
  screenCoords: number[]
  selectedEditHandleIndex: number
  selectedFeature: Feature
  selectedFeatureIndex: number
}

function MapDraw() {
  const { t } = useTranslation()
  const editorRef = useRef<any>(null)
  const [loading, setLoading] = useState(false)
  const [layerName, setLayerName] = useState<string>('')
  const [features, setFeatures] = useState<Feature[] | undefined>()
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState<number | null>(null)
  const [selectedEditHandleIndex, setSelectedEditHandleIndex] = useState<number | null>(null)
  const hasFeatureSelected = selectedFeatureIndex !== null
  const { drawMode, dispatchSetDrawMode } = useMapDrawConnect()
  const { containerRef } = useMapControl()
  const { dispatchCreateDataset } = useDatasetsAPI()
  const { addDataviewFromDatasetToWorkspace } = useAddDataviewFromDatasetToWorkspace()

  const currentFeature: Feature | null =
    selectedFeatureIndex !== null && features !== undefined
      ? features?.[selectedFeatureIndex]
      : null
  const currentEditHandle =
    currentFeature && selectedEditHandleIndex
      ? currentFeature.geometry.coordinates?.[0]?.[selectedEditHandleIndex]
      : null

  const updatePointPosition = useCallback(
    (features: Feature[], coordinateType: 'latitude' | 'longitude', coordinateValue: number) => {
      const newFeatures = features?.map((feature, index) => {
        if (index !== selectedFeatureIndex) {
          return feature
        }
        return {
          ...feature,
          geometry: {
            ...feature.geometry,
            coordinates: feature.geometry.coordinates.map((coordinates) => {
              const isLastCoordinate = selectedFeatureIndex === coordinates.length - 1
              return coordinates.map((point, index) => {
                if (index === selectedEditHandleIndex || (isLastCoordinate && index === 0)) {
                  return coordinateType === 'latitude'
                    ? [point[0], coordinateValue]
                    : [coordinateValue, point[1]]
                }
                return point
              })
            }),
          },
        } as Feature
      })
      if (newFeatures && newFeatures.length) {
        setFeatures(newFeatures)
      }
    },
    [selectedEditHandleIndex, selectedFeatureIndex]
  )
  const onHandleLatitudeChange = useCallback(
    (e) => {
      const latitude = parseFloat(e.target.value)
      if (features && latitude > -90 && latitude < 90) {
        updatePointPosition(features, 'latitude', latitude)
      }
    },
    [features, updatePointPosition]
  )

  const onHandleLongitudeChange = useCallback(
    (e) => {
      const longitude = parseFloat(e.target.value)
      if (features && longitude > -90 && longitude < 90) {
        updatePointPosition(features, 'longitude', longitude)
      }
    },
    [features, updatePointPosition]
  )

  const onEditorSelect = useCallback((e: EditorSelect) => {
    setSelectedFeatureIndex(e.selectedFeatureIndex)
    setSelectedEditHandleIndex(e.selectedEditHandleIndex)
  }, [])

  const onEditorUpdate = useCallback(
    (e: EditorUpdate) => {
      setFeatures(e.data)
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

  const closeDraw = useCallback(() => {
    setLayerName('')
    setFeatures(undefined)
    dispatchSetDrawMode('disabled')
  }, [dispatchSetDrawMode])

  const createDataset = useCallback(
    async (features: Feature[], name) => {
      if (features && features.length > 0) {
        setLoading(true)
        const file = new File(
          [
            JSON.stringify({
              type: 'FeatureCollection',
              features: features,
            }),
          ],
          `${name}.json`,
          {
            type: 'application/json',
          }
        )
        const dataset = {
          name,
          public: true,
          type: DatasetTypes.Context,
          category: DatasetCategory.Context,
          configuration: {
            format: 'geojson',
            geometryType: 'draw',
          } as DatasetConfiguration,
        }
        const { payload, error } = await dispatchCreateDataset({
          dataset,
          file,
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
            <label>{t('common.latitude', 'Latitude')}</label>
            <InputText
              value={currentEditHandle[1]}
              onChange={onHandleLatitudeChange}
              inputSize="small"
            />
            <label>{t('common.longitude', 'longitude')}</label>
            <InputText
              value={currentEditHandle[0]}
              onChange={onHandleLongitudeChange}
              inputSize="small"
            />
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
