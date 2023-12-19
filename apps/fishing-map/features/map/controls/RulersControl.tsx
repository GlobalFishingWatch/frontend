import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import useRulers from 'features/map/rulers/rulers.hooks'
import MapControlGroup from 'features/map/controls/MapControlGroup'
import { useMapAnnotation } from 'features/map/annotations/annotations.hooks'
import useMapInstance from '../map-context.hooks'

const Rulers = () => {
  const { t } = useTranslation()
  const { cleanFeatureState } = useFeatureState(useMapInstance())
  const { setMapAnnotationEdit, isMapAnnotating } = useMapAnnotation()
  const {
    rulers,
    editingRuler,
    rulersEditing,
    rulersVisible,
    toggleRulersVisibility,
    toggleRulersEditing,
    resetRulers,
    resetEditingRule,
  } = useRulers()

  const onToggleClick = useCallback(() => {
    if (isMapAnnotating) {
      setMapAnnotationEdit(false)
    }
    if (rulersEditing) {
      if (editingRuler) {
        resetEditingRule()
      }
      cleanFeatureState('click')
    }
    toggleRulersEditing()
  }, [
    cleanFeatureState,
    editingRuler,
    isMapAnnotating,
    resetEditingRule,
    rulersEditing,
    setMapAnnotationEdit,
    toggleRulersEditing,
  ])

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
