import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import type { Feature, Polygon } from 'geojson'

import { Button, IconButton, InputText } from '@globalfishingwatch/ui-components'

import PopupWrapper from 'features/map/popups/PopupWrapper'
import { selectMapDrawingMode } from 'routes/routes.selectors'

import { useDrawLayerInstance } from './draw.hooks'

import styles from './DrawDialog.module.css'

export const CoordinateEditOverlay = () => {
  const { t } = useTranslation()
  const drawLayer = useDrawLayerInstance()
  const drawingMode = useSelector(selectMapDrawingMode)

  const [newPointLatitude, setNewPointLatitude] = useState<number | string | null>(null)
  const [newPointLongitude, setNewPointLongitude] = useState<number | string | null>(null)

  const drawData = drawLayer?.getData()
  const currentFeatureIndexes = drawLayer?.getSelectedFeatureIndexes()
  const currentPointCoordinates = drawLayer?.getSelectedPointCoordinates()
  const hasOverlappingFeatures = drawLayer?.getHasOverlappingFeatures()
  const editingPointLatitude =
    newPointLatitude !== null ? Number(newPointLatitude) : Number(currentPointCoordinates?.[1])
  const editingPointLongitude =
    newPointLongitude !== null ? Number(newPointLongitude) : Number(currentPointCoordinates?.[0])

  useEffect(() => {
    if (!currentPointCoordinates?.length) {
      setNewPointLatitude(null)
      setNewPointLongitude(null)
    }
  }, [currentPointCoordinates])

  const allowDeletePoint =
    drawingMode === 'polygons'
      ? drawData &&
        currentFeatureIndexes?.every(
          (index) =>
            (drawData?.features as Feature<Polygon>[])?.[index]?.geometry?.coordinates?.[0].length >
            4
        )
      : true

  const onHandleLatitudeChange = useCallback(
    (e: any) => {
      if (e.target.value) {
        const latitude = parseFloat(e.target.value)
        if (latitude > -90 && latitude < 90) {
          setNewPointLatitude(latitude)
          drawLayer?.setTentativeCurrentPointCoordinates([editingPointLongitude, latitude])
        }
      } else {
        setNewPointLatitude('')
      }
    },
    [drawLayer, editingPointLongitude]
  )

  const onHandleLongitudeChange = useCallback(
    (e: any) => {
      if (e.target.value) {
        const longitude = parseFloat(e.target.value)
        if (longitude > -180 && longitude < 180) {
          setNewPointLongitude(longitude)
          drawLayer?.setTentativeCurrentPointCoordinates([longitude, editingPointLatitude])
        }
      } else {
        setNewPointLongitude('')
      }
    },
    [drawLayer, editingPointLatitude]
  )

  const resetEditingPoint = useCallback(() => {
    // As this is triggered with clickOutside we need to wait to reset
    // in case before the deleteSelectedPosition is called
    setTimeout(() => {
      setNewPointLatitude(null)
      setNewPointLongitude(null)
      drawLayer?.resetSelectedPoint()
    }, 1)
  }, [drawLayer])

  const onDeletePoint = useCallback(() => {
    if (allowDeletePoint) {
      drawLayer?.deleteSelectedPosition()
      resetEditingPoint()
    }
  }, [allowDeletePoint, drawLayer, resetEditingPoint])

  const onConfirm = useCallback(() => {
    drawLayer?.setCurrentPointCoordinates([editingPointLongitude, editingPointLatitude])
    resetEditingPoint()
  }, [drawLayer, editingPointLatitude, editingPointLongitude, resetEditingPoint])

  if (!currentPointCoordinates?.length) {
    return null
  }

  return (
    <PopupWrapper
      latitude={editingPointLatitude}
      longitude={editingPointLongitude}
      onClose={resetEditingPoint}
    >
      <div className={styles.popupContent}>
        <div className={styles.flex}>
          <InputText
            step="0.01"
            type="number"
            value={editingPointLatitude}
            label={t('common.latitude', 'Latitude')}
            onChange={onHandleLatitudeChange}
            className={styles.coordinateInput}
          />
          <InputText
            step="0.01"
            type="number"
            value={editingPointLongitude}
            label={t('common.longitude', 'longitude')}
            className={styles.coordinateInput}
            onChange={onHandleLongitudeChange}
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
              editingPointLongitude === null ||
              hasOverlappingFeatures
            }
            onClick={onConfirm}
            className={styles.confirmBtn}
          >
            {t('common.confirm', 'Confirm')}
          </Button>
        </div>
      </div>
    </PopupWrapper>
  )
}
