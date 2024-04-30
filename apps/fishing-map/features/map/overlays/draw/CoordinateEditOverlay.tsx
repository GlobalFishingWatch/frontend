import { HtmlOverlay, HtmlOverlayItem } from '@nebula.gl/overlays'
import { useTranslation } from 'react-i18next'
import { useCallback, useState } from 'react'
import { Button, InputText } from '@globalfishingwatch/ui-components'
import { useMapViewport } from 'features/map/map-viewport.hooks'
import { useDrawLayer } from './draw.hooks'
import styles from './DrawDialog.module.css'

export const CoordinateEditOverlay = (): React.ReactNode | null => {
  const { t } = useTranslation()
  const viewport = useMapViewport()
  const [newPointLatitude, setNewPointLatitude] = useState<number | string | null>(null)
  const [newPointLongitude, setNewPointLongitude] = useState<number | string | null>(null)
  const { updatedPoint, drawFeaturesIndexes, drawFeatures, setDrawFeatures } = useDrawLayer()

  const currentPointCoordinates = updatedPoint?.coordinates
  const editingPointLatitude =
    newPointLatitude !== null ? Number(newPointLatitude) : Number(currentPointCoordinates?.[1])
  const editingPointLongitude =
    newPointLongitude !== null ? Number(newPointLongitude) : Number(currentPointCoordinates?.[0])
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

  const onConfirm = useCallback(() => {
    console.log('confirming')
    setDrawFeatures({
      ...drawFeatures,
      features: drawFeatures.features.map((feature, index) => {
        const featureToUpdate = index === drawFeaturesIndexes[0]
        debugger
        return featureToUpdate
          ? {
              ...feature,
              geometry: {
                ...feature.geometry,
                coordinates: feature.geometry.coordinates[0].map((c, i) =>
                  i === updatedPoint?.index ? [editingPointLongitude, editingPointLatitude] : c
                ),
              },
            }
          : feature
      }),
    })
  }, [
    drawFeatures,
    drawFeaturesIndexes,
    editingPointLatitude,
    editingPointLongitude,
    setDrawFeatures,
    updatedPoint?.index,
  ])
  return currentPointCoordinates ? (
    <div onPointerUp={(event) => event.preventDefault()} className={styles.popup}>
      <HtmlOverlay viewport={viewport} key="1">
        <HtmlOverlayItem
          style={{ pointerEvents: 'all', transform: 'translate(-50%,-105%)' }}
          coordinates={[Number(editingPointLongitude), Number(editingPointLatitude)]}
        >
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
              {/* <IconButton
                icon="delete"
                type="warning-border"
                onClick={onDeletePoint}
                disabled={!allowDeletePoint}
                tooltip={
                  allowDeletePoint
                    ? t('layer.removePoint', 'Remove point')
                    : t('layer.removePointNotAllowed', 'Geometry needs at least 3 points')
                }
              /> */}
              <Button
                disabled={
                  editingPointLatitude === null ||
                  editingPointLatitude === '' ||
                  editingPointLongitude === null ||
                  editingPointLongitude === ''
                }
                onClick={onConfirm}
                className={styles.confirmBtn}
              >
                {t('common.confirm', 'Confirm')}
              </Button>
            </div>
          </div>
        </HtmlOverlayItem>
      </HtmlOverlay>
    </div>
  ) : null
}
