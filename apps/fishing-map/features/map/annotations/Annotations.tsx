import { useCallback } from 'react'
import cx from 'classnames'
import { useSelector, batch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'
import { selectMapAnnotations } from 'features/app/app.selectors'
import useMapInstance from '../map-context.hooks'
import {
  resetMapAnnotations,
  selectIsMapAnnotating,
  toggleMapAnnotating,
} from './annotations.slice'
import styles from './Annotations.module.css'

const MapAnnotations = () => {
  const { t } = useTranslation()
  const isAnnotating = useSelector(selectIsMapAnnotating)
  const { isMapDrawing } = useMapDrawConnect()
  const { cleanFeatureState } = useFeatureState(useMapInstance())
  const mapAnnotations = useSelector(selectMapAnnotations)

  const dispatch = useAppDispatch()
  const onToggleClick = useCallback(() => {
    dispatch(toggleMapAnnotating())
    if (isAnnotating) {
      cleanFeatureState('click')
    }
  }, [cleanFeatureState, dispatch, isAnnotating])

  const onRemoveClick = useCallback(() => {
    batch(() => {
      dispatch(resetMapAnnotations())
    })
  }, [dispatch])

  return (
    <div className={styles.container}>
      <IconButton
        icon="edit"
        disabled={isMapDrawing}
        type="map-tool"
        tooltip={isAnnotating ? '' : t('map.rulers_add', 'Add rulers')}
        className={cx({ [styles.active]: isAnnotating })}
        onClick={onToggleClick}
      >
        {mapAnnotations?.length > 0 && (
          <div className={cx(styles.num)}>{mapAnnotations.length}</div>
        )}
      </IconButton>
      {mapAnnotations?.length > 0 && (
        <IconButton
          icon="close"
          type="map-tool"
          tooltip={t('map.rulers_remove', 'Remove all rulers')}
          className={styles.remove}
          onClick={onRemoveClick}
        />
      )}
    </div>
  )
}

export default MapAnnotations
