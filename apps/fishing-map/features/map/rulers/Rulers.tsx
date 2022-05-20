import { useCallback } from 'react'
import cx from 'classnames'
import { useSelector, batch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'
import useMapInstance from '../map-context.hooks'
import {
  toggleRulersEditing,
  resetRulers,
  selectEditing,
  selectNumRulers,
  setRulersEditing,
} from './rulers.slice'
import styles from './Rulers.module.css'

const Rulers = () => {
  const { t } = useTranslation()
  const editing = useSelector(selectEditing)
  const { isMapDrawing } = useMapDrawConnect()
  const numRulers = useSelector(selectNumRulers)
  const { cleanFeatureState } = useFeatureState(useMapInstance())

  const dispatch = useAppDispatch()
  const onToggleClick = useCallback(() => {
    dispatch(toggleRulersEditing())
    if (editing) {
      cleanFeatureState('click')
    }
  }, [cleanFeatureState, dispatch, editing])

  const onRemoveClick = useCallback(() => {
    batch(() => {
      dispatch(resetRulers())
      dispatch(setRulersEditing(false))
    })
  }, [dispatch])

  return (
    <div className={styles.container}>
      <IconButton
        icon="ruler"
        disabled={isMapDrawing}
        type="map-tool"
        tooltip={editing ? '' : t('map.rulers_add', 'Add rulers')}
        className={cx({ [styles.active]: editing })}
        onClick={onToggleClick}
      >
        {numRulers > 0 && <div className={cx(styles.num)}>{numRulers}</div>}
      </IconButton>
      {numRulers > 0 && (
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

export default Rulers
