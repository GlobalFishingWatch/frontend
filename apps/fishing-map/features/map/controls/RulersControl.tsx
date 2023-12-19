import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import useRulers from 'features/map/rulers/rulers.hooks'
import MapControlGroup from 'features/map/controls/MapControlGroup'
import { setMapAnnotating } from 'features/map/annotations/annotations.slice'
import { useMapAnnotation } from 'features/map/annotations/annotations.hooks'
import useMapInstance from '../map-context.hooks'
import { resetEditingRule, toggleRulersEditing } from '../rulers/rulers.slice'

const Rulers = () => {
  const { t } = useTranslation()
  const { cleanFeatureState } = useFeatureState(useMapInstance())
  const { isMapAnnotating } = useMapAnnotation()
  const {
    editingRuler,
    rulers,
    rulersEditing,
    rulersVisible,
    toggleRulersVisibility,
    resetRulers,
  } = useRulers()

  const dispatch = useAppDispatch()
  const onToggleClick = useCallback(() => {
    if (isMapAnnotating) {
      dispatch(setMapAnnotating(false))
    }
    if (rulersEditing) {
      if (editingRuler) {
        dispatch(resetEditingRule())
      }
      cleanFeatureState('click')
    }
    dispatch(toggleRulersEditing())
  }, [cleanFeatureState, dispatch, editingRuler, isMapAnnotating, rulersEditing])

  return (
    <MapControlGroup
      icon="ruler"
      active={rulersEditing}
      visible={rulersVisible}
      expanded={rulers?.length > 0}
      editTooltip={
        rulersEditing
          ? t('map.rulersStop', 'Stop editing measures')
          : t('map.rulers_add', 'Measure distance')
      }
      deleteTooltip={t('map.rulersDelete', 'Delete all measures')}
      onClick={onToggleClick}
      onVisibilityClick={toggleRulersVisibility}
      onDeleteClick={resetRulers}
    />
  )
}

export default Rulers
