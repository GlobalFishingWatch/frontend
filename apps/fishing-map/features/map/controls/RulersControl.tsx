import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import useRulers from 'features/map/rulers/rulers.hooks'
import MapControlGroup from 'features/map/controls/MapControlGroup'
import { setMapAnnotating } from 'features/map/annotations/annotations.slice'
import useMapInstance from '../map-context.hooks'
import { toggleRulersEditing } from '../rulers/rulers.slice'

const Rulers = () => {
  const { t } = useTranslation()
  const { cleanFeatureState } = useFeatureState(useMapInstance())
  const { rulers, rulersEditing, rulersVisible, toggleRulersVisibility, resetRulers } = useRulers()

  const dispatch = useAppDispatch()
  const onToggleClick = useCallback(() => {
    dispatch(setMapAnnotating(false))
    dispatch(toggleRulersEditing())
    if (rulersEditing) {
      cleanFeatureState('click')
    }
  }, [cleanFeatureState, dispatch, rulersEditing])

  return (
    <MapControlGroup
      icon="ruler"
      active={rulersEditing}
      visible={rulersVisible}
      expanded={rulers?.length > 0}
      tooltip={
        rulersEditing
          ? t('map.rulersStop', 'Stop measures')
          : t('map.rulers_add', 'Measure distance')
      }
      onClick={onToggleClick}
      onVisibilityClick={toggleRulersVisibility}
      onResetClick={resetRulers}
    />
  )
}

export default Rulers
