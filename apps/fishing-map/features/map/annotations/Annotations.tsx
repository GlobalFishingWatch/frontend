import { Popup } from 'react-map-gl'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
  Button,
  ColorBar,
  IconButton,
  InputText,
  LineColorBarOptions,
} from '@globalfishingwatch/ui-components'
import { useEventKeyListener } from '@globalfishingwatch/react-hooks'
import { useMapAnnotation, useMapAnnotations } from 'features/map/annotations/annotations.hooks'
import { DEFAUL_ANNOTATION_COLOR } from 'features/map/map.config'
import { useLocationConnect } from 'routes/routes.hook'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'
import styles from './Annotations.module.css'

const colors = [{ id: 'white', value: DEFAUL_ANNOTATION_COLOR }, ...LineColorBarOptions]

const MapAnnotations = () => {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const gfwUser = useSelector(selectIsGFWUser)
  const { mapAnnotation, resetMapAnnotation, setMapAnnotation } = useMapAnnotation()
  const { deleteMapAnnotation, upsertMapAnnotations } = useMapAnnotations()
  const onConfirmClick = () => {
    if (!mapAnnotation) {
      return
    }
    upsertMapAnnotations({
      ...mapAnnotation,
      id: mapAnnotation.id || Date.now(),
    })
    resetMapAnnotation()
    dispatchQueryParams({ mapAnnotationsVisible: true })
  }
  const ref = useEventKeyListener(['Enter'], onConfirmClick)

  if (!mapAnnotation) {
    return null
  }

  const onDeleteClick = () => {
    deleteMapAnnotation(mapAnnotation.id)
    resetMapAnnotation()
  }

  if (!gfwUser) {
    return null
  }

  return (
    <Popup
      latitude={mapAnnotation.lat as number}
      longitude={mapAnnotation.lon as number}
      closeButton={true}
      closeOnClick={false}
      onClose={resetMapAnnotation}
      maxWidth="330px"
      className={styles.popup}
    >
      <div className={styles.popupContent} ref={ref}>
        <div className={styles.flex}>
          <InputText
            value={mapAnnotation?.label || ''}
            onChange={(e) => setMapAnnotation({ label: e.target.value })}
            placeholder={t('map.annotationPlaceholder', 'Type something here')}
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
          <Button
            onClick={onConfirmClick}
            className={styles.confirmBtn}
            disabled={!mapAnnotation.label}
          >
            {t('common.confirm', 'Confirm')}
          </Button>
        </div>
      </div>
    </Popup>
  )
}

export default MapAnnotations
