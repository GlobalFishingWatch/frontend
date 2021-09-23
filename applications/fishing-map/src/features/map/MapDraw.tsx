import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react'
import cx from 'classnames'
import { Feature } from 'geojson'
import { Editor, EditingMode, DrawPolygonMode } from 'react-map-gl-draw'
import { useTranslation } from 'react-i18next'
import Button from '@globalfishingwatch/ui-components/dist/button'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { useMapDrawConnect } from './map-draw.hooks'
import styles from './MapDraw.module.css'
import { useMapControl } from './map-context.hooks'

type EditorUpdate = {
  data: Feature
  editType: 'addFeature' | 'addPosition' | 'finishMovePosition'
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
  const [layerName, setLayerName] = useState<string>('')
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState<number | null>(null)
  const hasFeatureSelected = selectedFeatureIndex !== null
  const { drawMode, dispatchSetDrawMode } = useMapDrawConnect()
  const { containerRef } = useMapControl()

  const onUpdate = useCallback(
    (e: EditorUpdate) => {
      if (e.editType === 'addFeature') {
        dispatchSetDrawMode('edit')
      }
    },
    [dispatchSetDrawMode]
  )

  const onSelect = useCallback((e: EditorSelect) => {
    setSelectedFeatureIndex(e.selectedFeatureIndex)
  }, [])

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
    if (editorRef.current && selectedFeatureIndex !== undefined) {
      editorRef.current.deleteFeatures(selectedFeatureIndex)
    }
  }, [selectedFeatureIndex])

  const closeDraw = useCallback(() => {
    dispatchSetDrawMode('disabled')
  }, [dispatchSetDrawMode])

  const onSaveClick = useCallback(() => {
    console.log('DOIT')
    console.log(layerName)
    console.log(editorRef.current.getFeatures())
    setLayerName('')
    closeDraw()
  }, [closeDraw, layerName])

  const editorMode = useMemo(() => {
    if (drawMode === 'disabled') {
      return
    }
    return drawMode === 'edit' ? new EditingMode() : new DrawPolygonMode()
  }, [drawMode])

  const hasFeaturesDrawn = editorRef.current?.getFeatures()?.length > 0
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
          mode={editorMode}
          onUpdate={onUpdate}
          onSelect={onSelect}
        />
      )}
      <div
        ref={containerRef}
        // onMouseEnter={onContainerHover}
        // onClick={onContainerClick}
        className={cx(styles.container, { [styles.hidden]: !editorMode })}
      >
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
