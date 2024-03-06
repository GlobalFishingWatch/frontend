import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { HtmlOverlay, HtmlOverlayItem } from '@nebula.gl/overlays'
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
import { useDeckMap } from '../map-context.hooks'
import { useMapViewport } from '../map-viewport.hooks'
import styles from './Annotations.module.css'
/* eslint-disable react/prop-types */
const colors = [{ id: 'white', value: DEFAUL_ANNOTATION_COLOR }, ...LineColorBarOptions]

const MapAnnotationsDialog = (): React.ReactNode | null => {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const gfwUser = useSelector(selectIsGFWUser)
  const { mapAnnotation, resetMapAnnotation, setMapAnnotation, isMapAnnotating } =
    useMapAnnotation()
  const deck = useDeckMap()
  const viewport = useMapViewport()
  const { deleteMapAnnotation, upsertMapAnnotations } = useMapAnnotations()
  const isDialogVisible = gfwUser && isMapAnnotating && mapAnnotation
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

  if (isMapAnnotating) {
    deck.setProps({ getCursor: () => 'crosshair' })
  }

  if (!isDialogVisible) {
    return null
  }

  const onDeleteClick = () => {
    deleteMapAnnotation(mapAnnotation.id)
    resetMapAnnotation()
  }

  return (
    <div onPointerUp={(event) => event.preventDefault()}>
      <HtmlOverlay viewport={viewport} key="1">
        <HtmlOverlayItem
          style={{ pointerEvents: 'all', transform: 'translate(-50%,-105%)' }}
          coordinates={[Number(mapAnnotation.lon), Number(mapAnnotation.lat)]}
        >
          <div className={styles.popup}>
            <div className={styles.tooltipArrow} />
            <IconButton icon="close" onClick={resetMapAnnotation} className={styles.closeButton} />
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
          </div>
        </HtmlOverlayItem>
      </HtmlOverlay>
    </div>
  )
}

export default MapAnnotationsDialog
