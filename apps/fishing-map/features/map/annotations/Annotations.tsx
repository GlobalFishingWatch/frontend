import { useSelector } from 'react-redux'
import cx from 'classnames'
import { Popup } from 'react-map-gl'
import { useTranslation } from 'react-i18next'
import {
  Button,
  ColorBar,
  IconButton,
  InputText,
  LineColorBarOptions,
} from '@globalfishingwatch/ui-components'
import useMapAnnotations from 'features/map/annotations/annotations.hooks'
import { useMapAnnotationDrag } from 'features/map/annotations/annotations-drag.hooks'
import { selectMapAnnotation } from './annotations.slice'
import styles from './Annotations.module.css'

const colors = [{ id: 'white', value: '#ffffff' }, ...LineColorBarOptions]

const MapAnnotations = () => {
  useMapAnnotationDrag()
  const { t } = useTranslation()
  const mapAnnotation = useSelector(selectMapAnnotation)
  const { resetMapAnnotation, deleteMapAnnotation, setMapAnnotation, upsertMapAnnotation } =
    useMapAnnotations()

  if (!mapAnnotation) {
    return null
  }

  const onDeleteClick = () => {
    deleteMapAnnotation(mapAnnotation.id)
    resetMapAnnotation()
  }

  const onConfirmClick = () => {
    upsertMapAnnotation({
      ...mapAnnotation,
      id: mapAnnotation.id || Date.now(),
    })
    resetMapAnnotation()
  }

  return (
    <Popup
      latitude={mapAnnotation.lat as number}
      longitude={mapAnnotation.lon as number}
      closeButton={true}
      closeOnClick={false}
      onClose={resetMapAnnotation}
      maxWidth="330px"
      className={cx(styles.popup)}
    >
      <div className={styles.popupContent}>
        <div className={styles.flex}>
          <InputText
            value={mapAnnotation.label}
            onChange={(e) => setMapAnnotation({ label: e.target.value })}
          />
          <ColorBar
            colorBarOptions={colors}
            selectedColor={mapAnnotation.color}
            onColorClick={(color) => {
              setMapAnnotation({ color: color.value })
            }}
          />
        </div>
        <div className={styles.popupButtons}>
          {mapAnnotation.id && (
            <IconButton icon="delete" type="warning-border" onClick={onDeleteClick} />
          )}
          <Button onClick={onConfirmClick} className={styles.confirmBtn}>
            {t('common.confirm', 'Confirm')}
          </Button>
        </div>
      </div>
    </Popup>
  )
}

export default MapAnnotations
