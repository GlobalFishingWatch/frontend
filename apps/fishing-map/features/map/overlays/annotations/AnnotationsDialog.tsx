import { useTranslation } from 'react-i18next'
import {
  Button,
  ColorBar,
  IconButton,
  InputText,
  LineColorBarOptions,
} from '@globalfishingwatch/ui-components'
import { useEventKeyListener } from '@globalfishingwatch/react-hooks'
import { DEFAUL_ANNOTATION_COLOR } from 'features/map/map.config'
import { useLocationConnect } from 'routes/routes.hook'
import PopupWrapper from 'features/map/popups/PopupWrapper'
import { useMapAnnotation, useMapAnnotations } from './annotations.hooks'
import styles from './Annotations.module.css'

const colors = [{ id: 'white', value: DEFAUL_ANNOTATION_COLOR }, ...LineColorBarOptions]

const MapAnnotationsDialog = (): React.ReactNode | null => {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const { mapAnnotation, resetMapAnnotation, setMapAnnotation } = useMapAnnotation()
  const { deleteMapAnnotation, upsertMapAnnotations } = useMapAnnotations()

  const onConfirmClick = () => {
    if (!mapAnnotation) {
      return
    }
    upsertMapAnnotations({
      ...mapAnnotation,
      id: mapAnnotation?.id || Date.now(),
    })
    resetMapAnnotation()
    dispatchQueryParams({ mapAnnotationsVisible: true })
  }

  const onDeleteClick = () => {
    deleteMapAnnotation(mapAnnotation?.id)
    resetMapAnnotation()
  }

  const ref = useEventKeyListener(['Enter'], onConfirmClick)

  if (!mapAnnotation) {
    return null
  }

  return (
    <PopupWrapper
      latitude={Number(mapAnnotation.lat)}
      longitude={Number(mapAnnotation.lon)}
      onClose={resetMapAnnotation}
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
            selectedColor={mapAnnotation?.color}
            onColorClick={(color) => {
              setMapAnnotation({ color: color.value })
            }}
          />
        </div>
        <div className={styles.popupButtons}>
          {mapAnnotation?.id && (
            <IconButton icon="delete" type="warning-border" onClick={onDeleteClick} />
          )}
          <Button
            onClick={onConfirmClick}
            className={styles.confirmBtn}
            disabled={!mapAnnotation?.label}
          >
            {t('common.confirm', 'Confirm')}
          </Button>
        </div>
      </div>
    </PopupWrapper>
  )
}

export default MapAnnotationsDialog
