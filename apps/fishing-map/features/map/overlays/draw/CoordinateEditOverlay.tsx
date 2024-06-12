import { useTranslation } from 'react-i18next'
import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, IconButton, InputText } from '@globalfishingwatch/ui-components'
import { selectMapDrawingMode } from 'routes/routes.selectors'
import PopupWrapper from 'features/map/popups/PopupWrapper'
import { useDrawLayerInstance } from './draw.hooks'
import styles from './DrawDialog.module.css'

export const CoordinateEditOverlay = () => {
  const { t } = useTranslation()
  const drawLayer = useDrawLayerInstance()
  const drawingMode = useSelector(selectMapDrawingMode)

  const [newPointLatitude, setNewPointLatitude] = useState<number | string | null>(null)
  const [newPointLongitude, setNewPointLongitude] = useState<number | string | null>(null)

  const currentPointIndex = drawLayer?.getSelectedFeatureIndexes()?.[0] as number
  const drawData = drawLayer?.getData()
  const currentPointCoordinates =
    drawData?.features[currentPointIndex]?.geometry.type === 'Point'
      ? drawData?.features[currentPointIndex]?.geometry?.coordinates
      : null
  const editingPointLatitude =
    newPointLatitude !== null ? Number(newPointLatitude) : Number(currentPointCoordinates?.[1])
  const editingPointLongitude =
    newPointLongitude !== null ? Number(newPointLongitude) : Number(currentPointCoordinates?.[0])

  const allowDeletePoint =
    drawingMode === 'polygons' ? drawData && drawData?.features.length > 3 : true

  const onHandleLatitudeChange = useCallback(
    (e: any) => {
      if (e.target.value) {
        const latitude = parseFloat(e.target.value)
        if (latitude > -90 && latitude < 90) {
          setNewPointLatitude(latitude)
        }
      } else {
        setNewPointLatitude('')
      }
    },
    [setNewPointLatitude]
  )

  const onHandleLongitudeChange = useCallback(
    (e: any) => {
      if (e.target.value) {
        const longitude = parseFloat(e.target.value)
        if (longitude > -180 && longitude < 180) {
          setNewPointLongitude(longitude)
        }
      } else {
        setNewPointLongitude('')
      }
    },
    [setNewPointLongitude]
  )

  const onDeletePoint = useCallback(() => {
    drawLayer?.deleteSelectedFeature()
  }, [drawLayer])

  const onConfirm = useCallback(() => {
    console.log('TODO')
    // if (drawData) {
    //   const data = {
    //     ...drawData,
    //     features: drawData.features.map((feature, index) => {
    //       const featureToUpdate = index === currentPointIndex
    //       return featureToUpdate
    //         ? {
    //             ...feature,
    //             geometry: {
    //               ...feature.geometry,
    //               coordinates: feature.geometry.coordinates[0].map((c, i) =>
    //                 i === updatedPoint?.index ? [editingPointLongitude, editingPointLatitude] : c
    //               ),
    //             },
    //           }
    //         : feature
    //     }),
    //   }
    //   console.log(data)
    // }
  }, [])

  if (!currentPointCoordinates?.length) {
    return null
  }

  return (
    <PopupWrapper latitude={editingPointLongitude} longitude={editingPointLatitude}>
      <div className={styles.popupContent}>
        <div className={styles.flex}>
          <InputText
            step="0.01"
            type="number"
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
          />
        </div>
        <div className={styles.popupButtons}>
          <IconButton
            icon="delete"
            type="warning-border"
            onClick={onDeletePoint}
            disabled={false}
            tooltip={
              allowDeletePoint
                ? t('layer.removePoint', 'Remove point')
                : t('layer.removePointNotAllowed', 'Geometry needs at least 3 points')
            }
          />
          <Button
            disabled={editingPointLatitude === null || editingPointLongitude === null}
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
